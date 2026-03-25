import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "condominio",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let dbConnectionError = null;

// Test connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✓ Conectado a MySQL");
    await conn.release();
  } catch (err) {
    dbConnectionError = err;
    console.error("✗ Error de conexión a MySQL:", err.message);
  }
})();

function getDatabaseStatus() {
  if (dbConnectionError) {
    return {
      ok: false,
      message: "No se pudo conectar a MySQL",
      detail: dbConnectionError.message,
    };
  }
  return { ok: true };
}

// ============ USUARIOS ============

async function getUserByEmail(email) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id, name, email, password, confirmed, confirmToken, createdAt FROM users WHERE email = ?",
      [email]
    );
    return rows[0] || null;
  } finally {
    conn.release();
  }
}

async function getUserById(id) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id, name, email, password, confirmed, confirmToken, createdAt FROM users WHERE id = ?",
      [id]
    );
    return rows[0] || null;
  } finally {
    conn.release();
  }
}

async function createUser(email, userData) {
  const conn = await pool.getConnection();
  try {
    const { name, password, confirmed, confirmToken, createdAt } = userData;
    const [result] = await conn.query(
      "INSERT INTO users (name, email, password, confirmed, confirmToken, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, password, confirmed || false, confirmToken, createdAt || new Date()]
    );
    return { id: result.insertId, name, email, confirmed: confirmed || false, confirmToken };
  } finally {
    conn.release();
  }
}

async function updateUser(email, updates) {
  const conn = await pool.getConnection();
  try {
    const setClause = Object.keys(updates)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(updates), email];

    await conn.query(`UPDATE users SET ${setClause} WHERE email = ?`, values);

    const [rows] = await conn.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  } finally {
    conn.release();
  }
}

async function getUserByToken(token) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id, name, email, password, confirmed, confirmToken, createdAt FROM users WHERE confirmToken = ?",
      [token]
    );
    return rows[0] || null;
  } finally {
    conn.release();
  }
}

// ============ SESSION TOKENS ============

async function createSessionToken(userId, token, deviceId, expiresAt) {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      "INSERT INTO sessionTokens (userId, token, deviceId, createdAt, expiresAt) VALUES (?, ?, ?, ?, ?)",
      [userId, token, deviceId, new Date(), expiresAt]
    );
    return { id: result.insertId, userId, token, deviceId, expiresAt };
  } finally {
    conn.release();
  }
}

async function getSessionToken(token) {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id, userId, token, deviceId, createdAt, expiresAt FROM sessionTokens WHERE token = ?",
      [token]
    );
    return rows[0] || null;
  } finally {
    conn.release();
  }
}

async function deleteSessionToken(token) {
  const conn = await pool.getConnection();
  try {
    await conn.query("DELETE FROM sessionTokens WHERE token = ?", [token]);
  } finally {
    conn.release();
  }
}

async function deleteAllUserTokens(userId) {
  const conn = await pool.getConnection();
  try {
    await conn.query("DELETE FROM sessionTokens WHERE userId = ?", [userId]);
  } finally {
    conn.release();
  }
}

export {
  pool,
  getDatabaseStatus,
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  getUserByToken,
  createSessionToken,
  getSessionToken,
  deleteSessionToken,
  deleteAllUserTokens,
};
