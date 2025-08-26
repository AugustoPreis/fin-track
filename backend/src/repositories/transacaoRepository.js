const database = require('../config/database');

async function listar(params, conn) {
  const sql = `
    SELECT
      transacoes.id,
      transacoes.tipo,
      transacoes.valor,
      transacoes.data_transacao "dataTransacao",
      transacoes.descricao,
      categorias.id "categoriaId",
      categorias.nome "categoriaNome"
    FROM transacoes
      LEFT JOIN categorias ON categorias.id = transacoes.categoria_id
    WHERE transacoes.usuario_id = $1
      AND transacoes.ativo IS TRUE
      AND COALESCE(transacoes.descricao, '') ILIKE '%' || $2::varchar || '%'
      AND (
        $3::int IS NULL
        OR transacoes.categoria_id = $3::int
      )
      AND (
        $4::varchar = 'A'
        OR transacoes.tipo = $4::varchar
      )
      AND (
        $5::NUMERIC IS NULL
        OR transacoes.valor >= $5
      )
      AND (
        $6::NUMERIC IS NULL
        OR transacoes.valor <= $6
      )
      AND (
        $7::timestamp IS NULL
        OR date_trunc('minute', transacoes.data_transacao) >= date_trunc('minute', $7::timestamp)
      )
      AND (
        $8::timestamp IS NULL
        OR date_trunc('minute', transacoes.data_transacao) <= date_trunc('minute', $8::timestamp)
      )
      ORDER BY transacoes.data_transacao ${params.ordem}, transacoes.id DESC
      LIMIT 20 OFFSET $9
  `;

  const rows = await database.query(sql, [
    params.usuarioId,
    params.descricao,
    params.categoriaId,
    params.tipo,
    params.valorMinimo,
    params.valorMaximo,
    params.dataInicial,
    params.dataFinal,
    params.pular,
  ], conn);

  return rows;
}

async function listarParaAnalise(params, conn) {
  const sql = `
    SELECT
      categorias.nome "categoria",
      transacoes.tipo,
      transacoes.valor,
      transacoes.data_transacao "data",
      transacoes.descricao
    FROM transacoes
      LEFT JOIN categorias ON categorias.id = transacoes.categoria_id
    WHERE transacoes.usuario_id = $1
      AND transacoes.ativo IS TRUE
      AND
        date_trunc('day', transacoes.data_transacao)
          BETWEEN
        date_trunc('day', $2::timestamp)
          AND
        date_trunc('day', $3::timestamp)
    ORDER BY transacoes.data_transacao
  `;

  const rows = await database.query(sql, [
    params.usuarioId,
    params.dataInicial,
    params.dataFinal,
  ], conn);

  return rows;
}

async function buscarPorId(params, conn) {
  const sql = `
    SELECT
      transacoes.id,
      transacoes.tipo,
      transacoes.valor,
      transacoes.data_transacao "dataTransacao",
      transacoes.descricao,
      categorias.id "categoriaId",
      categorias.nome "categoriaNome"
    FROM transacoes
      LEFT JOIN categorias ON categorias.id = transacoes.categoria_id
    WHERE transacoes.id = $1
      AND transacoes.usuario_id = $2
      AND (
        transacoes.ativo IS TRUE
        OR $3::bool IS TRUE
      )
  `;

  const rows = await database.query(sql, [params.id, params.usuarioId, params.inativos], conn);

  return rows[0];
}

async function cadastrar(params, conn) {
  const sql = `
    INSERT INTO transacoes (
      usuario_id,
      categoria_id,
      tipo,
      valor,
      data_transacao,
      descricao,
      ativo,
      data_cadastro
    ) VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8
    ) RETURNING id
  `;

  const rows = await database.query(sql, [
    params.usuarioId,
    params.categoriaId,
    params.tipo,
    params.valor,
    params.dataTransacao,
    params.descricao,
    params.ativo,
    params.dataCadastro,
  ], conn);

  return rows[0].id;
}

async function atualizar(params, conn) {
  const sql = `
    UPDATE transacoes
    SET
      categoria_id = $3,
      tipo = $4,
      valor = $5,
      data_transacao = $6,
      descricao = $7
    WHERE id = $1
      AND usuario_id = $2
  `;

  await database.query(sql, [
    params.id,
    params.usuarioId,
    params.categoriaId,
    params.tipo,
    params.valor,
    params.dataTransacao,
    params.descricao,
  ], conn);
}

async function alterarSituacao(params, conn) {
  const sql = `
    UPDATE transacoes
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
  listarParaAnalise,
  buscarPorId,
  cadastrar,
  atualizar,
  alterarSituacao,
}