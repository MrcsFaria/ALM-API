-- 20240710111857_create_categories.sql
-- CreateTable
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    categoria VARCHAR(191) NOT NULL
);

-- 20240710111858_create_products.sql
-- CreateTable
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(191) NOT NULL,
    preco DOUBLE PRECISION NOT NULL,
    marca VARCHAR(191) NOT NULL,
    imagem VARCHAR(191) NOT NULL,
    tamanhos VARCHAR(191) NOT NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- 20240710111859_create_users.sql
-- CreateTable
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(191) NOT NULL,
    token VARCHAR(191) NOT NULL,
    cpf VARCHAR(191) NOT NULL
);
