const database = require('../config/database');
const { addTotal } = require('../utils/repository');

async function listar(params, conn) {
  const sql = `
    SELECT
      categorias.id,
      categorias.nome,
      categorias.tipo,
      categorias.cor,
      count(categorias.id) OVER() "total"
    FROM categorias
    WHERE categorias.usuario_id = $1
      AND categorias.nome ILIKE '%' || $2 || '%'
      AND (
        $3::varchar IS NULL
        OR COALESCE(categorias.cor, '') = COALESCE($3, '')
      )
      AND (
        $4::varchar IS NULL
        OR $4::varchar = 'A'
        OR categorias.tipo = $4::varchar
      )
      AND (
        categorias.ativo IS TRUE
        OR $5::bool IS TRUE
      )
    ORDER BY categorias.nome
    LIMIT 10 OFFSET $6
  `;

  const rows = await database.query(sql, [
    params.usuarioId,
    params.nome,
    params.cor,
    params.tipo,
    params.inativos,
    params.pular || 0,
  ], conn);

  return addTotal(rows);
}

async function buscarPorId(params, conn) {
  const sql = `
    SELECT
      categorias.id,
      categorias.nome,
      categorias.tipo,
      categorias.cor
    FROM categorias
    WHERE categorias.id = $1
      AND categorias.usuario_id = $2
      AND (
        categorias.ativo IS TRUE
        OR $3::bool IS TRUE
      )
  `;

  const rows = await database.query(sql, [
    params.id,
    params.usuarioId,
    params.inativos,
  ], conn);

  return rows[0];
}

async function cadastrar(params, conn) {
  const sql = `
    INSERT INTO categorias (
      nome,
      tipo,
      cor,
      usuario_id,
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
    params.tipo,
    params.cor,
    params.usuarioId,
    params.ativo,
    params.dataCadastro,
  ], conn);

  return rows[0].id;
}

async function atualizar(params, conn) {
  const sql = `
    UPDATE categorias
    SET
      nome = $3,
      tipo = $4,
      cor = $5
    WHERE id = $1
      AND usuario_id = $2
  `;

  await database.query(sql, [
    params.id,
    params.usuarioId,
    params.nome,
    params.tipo,
    params.cor,
  ], conn);
}

async function alterarSituacao(params, conn) {
  const sql = `
    UPDATE categorias
    SET
      ativo = $3
    WHERE id = $1
      AND usuario_id = $2
  `;

  await database.query(sql, [
    params.id,
    params.usuarioId,
    params.ativo,
  ], conn);
}

module.exports = {
  listar,
  buscarPorId,
  cadastrar,
  atualizar,
  alterarSituacao,
}