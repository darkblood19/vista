-- Script para actualizar la tabla users con campos de reseteo
-- Ejecuta esto en phpMyAdmin o en MySQL
ALTER TABLE users
ADD COLUMN resetCode VARCHAR(6) DEFAULT NULL,
ADD COLUMN resetCodeExpires DATETIME DEFAULT NULL;

CREATE INDEX idx_users_resetCode ON users (resetCode);