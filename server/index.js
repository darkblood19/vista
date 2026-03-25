import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import {
  pool,
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  getUserByToken,
  createSessionToken,
  getSessionToken,
  deleteSessionToken,
  deleteUserDeviceToken,
  deleteAllUserTokens,
  getDatabaseStatus,
} from "./db.js";
import { sendConfirmationEmail } from "./mailer.js";

dotenv.config();

const app = express();
const PORT = process.env.SERVER_PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

app.use(cors());
app.use(bodyParser.json());

function getEmailConfigStatus() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return {
      ok: false,
      message: "Falta configurar GMAIL_USER o GMAIL_APP_PASSWORD en el archivo .env",
    };
  }

  return { ok: true };
}

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const session = await getSessionToken(token);
    if (!session || new Date() > session.expiresAt) {
      return res.status(401).json({ message: "Token invalido o expirado" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token invalido" });
      }

      req.user = user;
      next();
    });
  } catch (err) {
    console.error("Error en autenticacion:", err);
    res.status(500).json({ message: "Error en autenticacion" });
  }
};

function hashPassword(password) {
  return Buffer.from(password).toString("base64");
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const dbStatus = getDatabaseStatus();
    if (!dbStatus.ok) {
      return res.status(503).json({ message: dbStatus.message, detail: dbStatus.detail });
    }

    const emailStatus = getEmailConfigStatus();
    if (!emailStatus.ok) {
      return res.status(503).json({ message: emailStatus.message });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El correo ya esta registrado" });
    }

    const confirmToken = uuidv4();
    const userData = {
      name,
      password: hashPassword(password),
      confirmed: false,
      confirmToken,
      createdAt: new Date(),
    };

    await createUser(email, userData);

    const confirmUrl = `${FRONTEND_URL}/confirm?token=${confirmToken}`;
    const emailSent = await sendConfirmationEmail(email, name, confirmUrl);

    if (!emailSent) {
      return res
        .status(503)
        .json({ message: "No se pudo enviar el correo de confirmacion. Revisa la configuracion SMTP." });
    }

    res.status(201).json({
      message: "Usuario registrado. Revisa tu correo para confirmar",
      email,
    });
  } catch (err) {
    console.error("Error en registro:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/api/confirm", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token no proporcionado" });
    }

    const dbStatus = getDatabaseStatus();
    if (!dbStatus.ok) {
      return res.status(503).json({ message: dbStatus.message, detail: dbStatus.detail });
    }

    const foundUser = await getUserByToken(token);
    if (!foundUser) {
      return res.status(404).json({ message: "Token invalido o expirado" });
    }

    await updateUser(foundUser.email, { confirmed: true, confirmToken: null });

    res.json({
      ok: true,
      message: "Correo confirmado. Puedes iniciar sesion ahora",
    });
  } catch (err) {
    console.error("Error en confirmacion:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    if (!email || !password || !deviceId) {
      return res.status(400).json({ message: "Correo, contrasena y deviceId requeridos" });
    }

    const dbStatus = getDatabaseStatus();
    if (!dbStatus.ok) {
      return res.status(503).json({ message: dbStatus.message, detail: dbStatus.detail });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    if (!user.confirmed) {
      return res.status(401).json({ message: "Correo no confirmado. Revisa tu email" });
    }

    if (!verifyPassword(password, user.password)) {
      return res.status(401).json({ message: "Contrasena incorrecta" });
    }

    // Eliminar token anterior de este dispositivo (si existe)
    await deleteUserDeviceToken(user.id, deviceId);

    // Crear nuevo token JWT
    const token = jwt.sign({ userId: user.id, deviceId }, JWT_SECRET, { expiresIn: "7d" });
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Guardar nueva sesión
    await createSessionToken(user.id, token, deviceId, expiresAt);

    res.json({
      ok: true,
      message: "Login exitoso",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.post("/api/logout", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await deleteSessionToken(token);
    res.json({ ok: true, message: "Sesion cerrada" });
  } catch (err) {
    console.error("Error en logout:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.post("/api/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Contrasena actual y nueva requeridas" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "La nueva contraseña debe ser diferente" });
    }

    const dbStatus = getDatabaseStatus();
    if (!dbStatus.ok) {
      return res.status(503).json({ message: dbStatus.message, detail: dbStatus.detail });
    }

    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!verifyPassword(currentPassword, user.password)) {
      return res.status(401).json({ message: "Contrasena actual incorrecta" });
    }

    // Actualizar contraseña
    await updateUser(user.email, { password: hashPassword(newPassword) });

    // Cerrar sesión en todos los dispositivos
    await deleteAllUserTokens(userId);

    res.json({
      ok: true,
      message: "Contraseña cambiada exitosamente. Sesión cerrada en todos los dispositivos. Por favor, inicia sesión nuevamente.",
    });
  } catch (err) {
    console.error("Error cambiando contrasena:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

app.get("/api/health", (req, res) => {
  const dbStatus = getDatabaseStatus();

  res.status(dbStatus.ok ? 200 : 503).json({
    status: dbStatus.ok ? "OK" : "DEGRADED",
    database: dbStatus,
    email: getEmailConfigStatus(),
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PORT}`);
  console.log(`SMTP configurado para: ${process.env.GMAIL_USER || "no configurado"}`);
});
