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
        role VARCHAR(50) DEFAULT 'user' COMMENT 'admin, moderator, user',
        confirmed BOOLEAN DEFAULT FALSE,
        confirmToken VARCHAR(255) DEFAULT NULL,
        resetCode VARCHAR(6) DEFAULT NULL,
        resetCodeExpires DATETIME DEFAULT NULL,
        isActive BOOLEAN DEFAULT TRUE,
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

-- Tabla de roles y permisos
CREATE TABLE
    IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    IF NOT EXISTS rolePermissions (
        roleId INT NOT NULL,
        permissionId INT NOT NULL,
        PRIMARY KEY (roleId, permissionId),
        FOREIGN KEY (roleId) REFERENCES roles (id) ON DELETE CASCADE,
        FOREIGN KEY (permissionId) REFERENCES permissions (id) ON DELETE CASCADE
    );

-- Insertar roles por defecto
INSERT IGNORE INTO roles (name, description)
VALUES
    ('admin', 'Administrador con acceso total'),
    ('moderator', 'Moderador con permisos limitados'),
    ('user', 'Usuario regular');

-- Crear índices para mejor rendimiento
CREATE INDEX idx_users_email ON users (email);

CREATE INDEX idx_users_confirmToken ON users (confirmToken);

CREATE INDEX idx_users_resetCode ON users (resetCode);

CREATE INDEX idx_users_role ON users (role);

CREATE INDEX idx_sessionTokens_token ON sessionTokens (token);

CREATE INDEX idx_sessionTokens_userId ON sessionTokens (userId);