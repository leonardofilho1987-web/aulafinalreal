import { DatabaseSync } from 'node:sqlite'

const banco = new DatabaseSync('banco.db')

banco.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL UNIQUE,
    senha   TEXT NOT NULL,
    nome    TEXT NOT NULL DEFAULT '',
    bio     TEXT NOT NULL DEFAULT '',
    foto    TEXT NOT NULL DEFAULT 'sem-foto.svg'
  );
  CREATE TABLE IF NOT EXISTS posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
    imagem     TEXT NOT NULL,
    legenda    TEXT NOT NULL DEFAULT ''
  );
`)

export default banco