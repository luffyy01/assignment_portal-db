require('dotenv').config()
const { Pool } = require('pg')

const db = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect()
    .then(() => console.log('connected to db'))
    .catch(e => console.log('db connection failed', e))

module.exports = db