module.exports = {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'adm_personal',
    host: 'localhost',
    dialect: 'postgres',
    pool: {
      max: 50,
      min: 20,
      idle: 15000
    }
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'FacturasV0.1',
    host: '192.168.1.152',
    dialect: 'postgres',
    logging: null
  },
  production: process.env.DATABASE_URL
};