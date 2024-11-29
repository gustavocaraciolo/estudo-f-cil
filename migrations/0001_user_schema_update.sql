-- Update users table schema
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome_completo TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  ddi TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Update certificacoes table schema if not exists
CREATE TABLE IF NOT EXISTS certificacoes (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create usuarios_certificacoes join table if not exists
CREATE TABLE IF NOT EXISTS usuarios_certificacoes (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  usuario_id INTEGER NOT NULL REFERENCES users(id),
  certificacao_id INTEGER NOT NULL REFERENCES certificacoes(id)
);
