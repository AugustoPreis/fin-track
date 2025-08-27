const database = require('../config/database');

async function buscarPorId(params, conn) {
  const sql = `
    SELECT
      usuarios.id,
      usuarios.nome,
      usuarios.email,
      usuarios.plano
    FROM usuarios
    WHERE usuarios.id = $1
      AND usuarios.ativo IS TRUE
  `;

  const rows = await database.query(sql, [params.id], conn);

  return rows[0];
}

async function buscarPorEmail(params, conn) {
  const sql = `
    SELECT
      usuarios.id,
      usuarios.nome,
      usuarios.email,
      usuarios.plano,
      usuarios.senha,
      usuarios.ativo
    FROM usuarios
    WHERE usuarios.email ILIKE $1
      AND (
        usuarios.ativo IS TRUE
        OR $2::bool IS TRUE
      )
  `;

  const rows = await database.query(sql, [params.email, !!params.inativos], conn);

  return rows[0];
}

async function cadastrar(params, conn) {
  const sql = `
    INSERT INTO usuarios (
      nome,
      plano,
      email,
      senha,
      ativo,
      data_cadastro
    ) VALUES (
      $1, 
      $2, 
      $3, 
      $4, 
      $5, 
      $6 
    ) RETURNING id
  `;

  const rows = await database.query(sql, [
    params.nome,
    params.plano,
    params.email,
    params.senha,
    params.ativo,
    params.dataCadastro,
  ], conn);

  return rows[0].id;
}

async function atualizar(params, conn) {
  const sql = `
    UPDATE usuarios
    SET
      nome = $2,
      email = $3,
      senha = COALESCE($4, senha)
    WHERE id = $1
      AND ativo IS TRUE
  `;

  await database.query(sql, [
    params.id,
    params.nome,
    params.email,
    params.senha,
  ], conn);
}

async function alterarSituacao(params, conn) {
  const sql = `
    UPDATE usuarios
    SET
      ativo = $2
    WHERE id = $1
  `;

  await database.query(sql, [params.id, !!params.ativo], conn);
}

module.exports = {
  buscarPorId,
  buscarPorEmail,
  cadastrar,
  atualizar,
  alterarSituacao,
}