function getEnv() {
  require('dotenv/config');

  const { env } = process;

  return {
    port: parseInt(env.PORT),
    jwtSecret: env.JWT_SECRET,
    dbHost: env.DB_HOST,
    dbPort: parseInt(env.DB_PORT),
    dbUser: env.DB_USER,
    dbName: env.DB_NAME,
    dbPassword: env.DB_PASS,
  };
}

module.exports = { getEnv }