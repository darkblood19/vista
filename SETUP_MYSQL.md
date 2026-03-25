# Configuración del Sistema de Registro con MySQL y Gmail SMTP

## Paso 1: Crear la base de datos y tablas

### Opción A: Usar phpMyAdmin (Recomendado)

1. Abre tu navegador y ve a `http://localhost/phpmyadmin`
2. Inicia sesión (usuario: `root`, password: vacío)
3. Haz clic en "SQL" en el menú superior
4. Copia todo el contenido de `server/create-tables.sql`
5. Pégalo en el editor SQL de phpMyAdmin
6. Haz clic en "Ejecutar"

### Opción B: Usar línea de comandos

```bash
cd server
mysql -u root < create-tables.sql
```

## Paso 2: Configurar las variables de entorno

### 2.1 Credenciales de Gmail (SMTP)

1. Ve a tu cuenta de Google: https://myaccount.google.com
2. Haz clic en "Seguridad" en el menú izquierdo
3. Busca "Contraseña de aplicaciones" (si no aparece, habilita la verificación en 2 pasos primero)
4. Selecciona "Mail" y "Windows Computer"
5. Copia la contraseña generada

### 2.2 Actualizar el archivo `.env`

Edita `server/.env` con tus datos:

```env
# MySQL (Estas credenciales suelen ser así en XAMPP por defecto)
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=condominio

# Gmail SMTP
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Server
SERVER_PORT=4000
FRONTEND_URL=http://localhost:5173

# JWT Secret (puedes dejar este valor o cambiarlo)
JWT_SECRET=tu-clave-secreta-segura
```

## Paso 3: Instalar dependencias

El servidor necesita el driver de MySQL. Instálalo con:

```bash
cd server
npm install mysql2
```

## Paso 4: Iniciar el servidor

```bash
npm start
```

Deberías ver en la consola:

```
✓ Conectado a MySQL
Servidor ejecutandose en http://localhost:4000
SMTP configurado para: tu-email@gmail.com
```

## Paso 5: Probar el registro

1. Abre `http://localhost:5173` en tu navegador
2. Haz clic en "Registrarse"
3. Completa el formulario con:
   - Nombre: Tu nombre
   - Correo: Un correo válido (preferiblemente uno que uses para testing)
   - Contraseña: Una contraseña cualquiera
4. Deberías recibir un email de confirmación

## Solucionar problemas

### Error: "No se pudo enviar el correo de confirmacion"

- Verifica que `GMAIL_USER` y `GMAIL_APP_PASSWORD` sean correctos en `.env`
- Asegúrate de haber generado una contraseña de aplicación (no tu contraseña de Gmail)
- Verifica que tengas habilitada la verificación en 2 pasos en tu cuenta de Google

### Error: "La conexion a MySQL aun no esta lista"

- Verifica que XAMPP esté corriendo y MySQL esté iniciado
- Verifica que las credenciales en `.env` sean correctas
- Verifica que la base de datos "condominio" existe (ejecuta el script SQL)

### El email no llega

- Revisa la carpeta de SPAM
- Si usas Gmail, puede que debas permitir "Aplicaciones menos seguras" (aunque es mejor usar contraseña de aplicación)

## Estructura de la base de datos

### Tabla: users

```sql
id          INT (primary key)
name        VARCHAR(255)
email       VARCHAR(255) UNIQUE
password    VARCHAR(255) - Almacenado en base64
confirmed   BOOLEAN (default: false)
confirmToken VARCHAR(255) - Token único para confirmar email
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
```

### Tabla: sessionTokens

```sql
id          INT (primary key)
userId      INT (foreign key → users.id)
token       VARCHAR(500) UNIQUE - JWT token
deviceId    VARCHAR(255)
createdAt   TIMESTAMP
expiresAt   DATETIME - Expira en 7 días
```

## Flujo de Registro y Confirmación

1. **Usuario se registra** → POST `/api/register`
   - Se crea usuario con `confirmed: false`
   - Se genera `confirmToken` único (UUID v4)
   - Se envía email con link de confirmación

2. **Usuario confirma email** → GET `/api/confirm?token={token}`
   - Se valida el token
   - Se actualiza `confirmed: true` y se limpia `confirmToken`
   - Usuario ahora puede hacer login

3. **Usuario inicia sesión** → POST `/api/login`
   - Se verifica email y contraseña
   - Se valida que `confirmed: true`
   - Se genera JWT token válido por 7 días
   - Se guarda sesión en `sessionTokens`

4. **Usuario accede rutas protegidas** → Middleware `authenticateToken`
   - Valida JWT token
   - Valida que sesión no haya expirado
   - Permite acceso o rechaza con 401/403
