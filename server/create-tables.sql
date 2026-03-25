-- Crear base de datos
CREATE DATABASE IF NOT EXISTS condominio;

USE condominio;

-- Tabla de usuarios
CREATE TABLE
    IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        confirmed BOOLEAN DEFAULT FALSE,
        confirmToken VARCHAR(255) DEFAULT NULL,
        resetCode VARCHAR(6) DEFAULT NULL,
        resetCodeExpires DATETIME DEFAULT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Tabla de tokens de sesión
CREATE TABLE
    IF NOT EXISTS sessionTokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        token VARCHAR(500) NOT NULL UNIQUE,
        deviceId VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expiresAt DATETIME NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
    );

-- Crear índices para mejor rendimiento
CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_confirmToken ON users (confirmToken);

CREATE INDEX idx_users_resetCode ON users (resetCode);

CREATE INDEX idx_sessionTokens_token ON sessionTokens (token);

CREATE INDEX idx_sessionTokens_userId ON sessionTokens (userId);