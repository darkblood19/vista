# Sistema de Roles y Middleware de Autenticación

## Descripción

Sistema completo de validación de sesiones y roles con middleware reutilizable.

---

## Roles disponibles

- **admin**: Acceso total, puede gestionar usuarios y roles
- **moderator**: Permisos limitados para moderar contenido
- **user**: Usuario regular (rol por defecto)

---

## Middleware

### 1. `authenticateToken` (Validar sesión activa)

Verifica que el usuario tenga una sesión válida y esté activo.

```javascript
app.get("/api/datos-protegidos", authenticateToken, (req, res) => {
  // Solo usuarios autenticados
});
```

**Información disponible en `req.user`:**

```javascript
{
  userId: 1,
  role: "admin",
  email: "usuario@ejemplo.com",
  name: "Nombre del usuario"
}
```

---

### 2. `authorizeRole(roles)` (Validar rol específico)

Verifica que el usuario tenga uno de los roles especificados.

**Uso combinado con `authenticateToken`:**

```javascript
// Solo admins
app.post(
  "/api/admin/accion",
  authenticateToken,
  authorizeRole(["admin"]),
  (req, res) => {
    // Solo administradores
  },
);

// Admins y moderators
app.post(
  "/api/moderar",
  authenticateToken,
  authorizeRole(["admin", "moderator"]),
  (req, res) => {
    // Solo admins y moderadores
  },
);
```

---

## Endpoints de Perfil y Roles

### Obtener Perfil del Usuario Actual

**GET** `/api/me`

**Headers requeridos:**

```
Authorization: Bearer {token}
```

**Respuesta:**

```json
{
  "ok": true,
  "user": {
    "id": 1,
    "name": "Nestor",
    "email": "nestor@ejemplo.com",
    "role": "user",
    "confirmed": true,
    "isActive": true,
    "createdAt": "2026-03-24T10:30:00Z"
  }
}
```

---

### Cambiar Rol de Usuario (Solo Admin)

**POST** `/api/users/{id}/role`

**Headers requeridos:**

```
Authorization: Bearer {token_admin}
Content-Type: application/json
```

**Body:**

```json
{
  "role": "moderator"
}
```

**Respuesta:**

```json
{
  "ok": true,
  "message": "Rol de Nestor actualizado a moderator",
  "user": {
    "id": 1,
    "email": "nestor@ejemplo.com",
    "name": "Nestor",
    "role": "moderator"
  }
}
```

**Errores:**

- `403`: No tienes permisos de admin
- `404`: Usuario no encontrado
- `400`: Rol inválido o intentas quitarte permisos a ti mismo

---

### Activar/Desactivar Usuario (Solo Admin)

**POST** `/api/users/{id}/toggle-active`

**Headers requeridos:**

```
Authorization: Bearer {token_admin}
```

**Respuesta:**

```json
{
  "ok": true,
  "message": "Cuenta de Nestor desactivada",
  "user": {
    "id": 1,
    "email": "nestor@ejemplo.com",
    "name": "Nestor",
    "isActive": false
  }
}
```

**Efectos:**

- Si se **desactiva**: Se cierran todas las sesiones del usuario automáticamente
- Si se **activa**: El usuario puede iniciar sesión nuevamente

**Errores:**

- `403`: No tienes permisos de admin
- `404`: Usuario no encontrado
- `400`: No puedes desactivar tu propia cuenta

---

### Listar Todos los Usuarios (Solo Admin)

**GET** `/api/users`

**Headers requeridos:**

```
Authorization: Bearer {token_admin}
```

**Respuesta:**

```json
{
  "ok": true,
  "users": [
    {
      "id": 1,
      "name": "Nestor Saavedra",
      "email": "nestor@ejemplo.com",
      "role": "admin",
      "confirmed": true,
      "isActive": true,
      "createdAt": "2026-03-24T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Juan Pérez",
      "email": "juan@ejemplo.com",
      "role": "user",
      "confirmed": true,
      "isActive": true,
      "createdAt": "2026-03-24T11:45:00Z"
    }
  ]
}
```

---

## Flujo de Validación

```
1. Usuario inicia sesión
   ↓
2. Recibe JWT token + se guarda en sessionTokens
   ↓
3. Usuario hace request con: Authorization: Bearer {token}
   ↓
4. authenticateToken valida:
   - Token existe
   - Token no ha expirado
   - Sesión existe en DB
   - Usuario existe en DB
   - Usuario está activo (isActive = true)
   ↓
5. Si hay restricción de rol:
   - authorizeRole verifica que el rol esté en la lista permitida
   ↓
6. Si todo es válido: req.user tiene acceso a userId, role, email, name
```

---

## Códigos de Error

| Código | Mensaje                   | Causa                                   |
| ------ | ------------------------- | --------------------------------------- |
| 401    | Token no proporcionado    | No incluiste Authorization header       |
| 401    | Token invalido o expirado | El token ha expirado                    |
| 401    | Usuario no encontrado     | El usuario fue eliminado                |
| 401    | Cuenta desactivada        | El usuario fue desactivado por un admin |
| 403    | Token invalido            | El token fue modificado                 |
| 403    | Acceso denegado           | No tienes el rol requerido              |

---

## Ejemplo de Implementación Frontend

```javascript
// Guardar token después de login
localStorage.setItem("token", response.token);

// Hacer request autenticado
const res = await fetch("/api/me", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

const { user } = await res.json();

// Verificar rol en el frontend
if (user.role === "admin") {
  // Mostrar botón de admin
}

// Si el usuario fue desactivado
if (!user.isActive) {
  // Redirigir a login
  localStorage.removeItem("token");
}
```

---

## Pasos para Configurar

1. **Ejecuta en phpMyAdmin** el script `migrate-roles.sql`:

   ```sql
   ALTER TABLE users
   ADD COLUMN role VARCHAR(50) DEFAULT 'user',
   ADD COLUMN isActive BOOLEAN DEFAULT TRUE;
   ```

2. **Haz admin al primer usuario** (opcional):

   ```sql
   UPDATE users SET role = 'admin' WHERE id = 1;
   ```

3. **Reinicia el servidor** para cargar los cambios

---

## Seguridad

✅ **Validación de sesión activa en cada request**  
✅ **Verificación de que el usuario esté en la DB**  
✅ **Control de cuenta activada/desactivada**  
✅ **Prevención de autoelevación de privilegios**  
✅ **Cierre de sesiones al cambiar contraseña**  
✅ **Cierre automático de sesiones al desactivar cuenta**
