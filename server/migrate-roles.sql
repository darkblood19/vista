-- Script para agregar campos role e isActive a usuarios existentes
-- Ejecuta esto en phpMyAdmin si ya tienes usuarios
-- Agregar columnas si no existen
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' COMMENT 'admin, moderator, user',
ADD COLUMN IF NOT EXISTS isActive BOOLEAN DEFAULT TRUE;

-- Crear índice para role
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- Hacer admin al primer usuario (opcional, descomenta si quieres)
-- UPDATE users SET role = 'admin' WHERE id = 1;