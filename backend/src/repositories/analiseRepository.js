const database = require('../config/database');

async function cadastrar(params, conn) {
  const sql = `
    INSERT INTO analises (
      usuario_id,
      data_inicio,
      data_final,
      resultado,
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
    params.usuarioId,
    params.dataInicio,
    params.dataFinal,
    params.resultado,
    params.ativo,
    params.dataCadastro,
  ], conn);

  return rows[0].id;
}

module.exports = { cadastrar };