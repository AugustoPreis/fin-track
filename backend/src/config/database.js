const pg = require('pg');
const { getEnv } = require('./dotenv');

const env = getEnv();

const pool = new pg.Pool({
  host: env.dbHost,
  port: env.dbPort,
  database: env.dbName,
  user: env.dbUser,
  password: env.dbPassword,
  idleTimeoutMillis: 30000, //Tempo antes de encerrar conexões ociosas
});

//Define o parser para colunas do tipo 'numeric'
pg.types.setTypeParser(1700, (value) => parseFloat(value));

async function query(sql, params = [], conn = null) {
  let result;

  if (conn) {
    result = await conn.query(sql, params);
  } else {
    result = await pool.query(sql, params);
  }

  return result.rows;
}

async function open() {
  const client = await pool.connect();

  await client.query('BEGIN');

  return client;
}

async function commit(conn) {
  try {
    await conn.query('COMMIT');
  } finally {
    conn.release();
  }
}

async function rollback(conn) {
  try {
    await conn.query('ROLLBACK');
  } finally {
    conn.release();
  }
}

function test(callback) {
  pool.connect((err, client, release) => {
    if (err) {
      return callback(err);
    }

    client.query('SELECT NOW()', (err) => {
      release();

      if (err) {
        return callback(err);
      }

      callback();
    });
  });
}

module.exports = {
  query,
  open,
  commit,
  rollback,
  test,
}