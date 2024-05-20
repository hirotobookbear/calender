import { NextResponse } from 'next/server';
 
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  ssl: ((process.env.DB_SSL && process.env.DB_SSL.toLowerCase() == 'true') || false)
    ? { rejectUnauthorized: false } : false,
});

export async function GET() {
  const client = await pool.connect();
  const ret = await client.query('select * from tests', []);
  await client.release(true);

  console.log(ret);

  return NextResponse.json(ret.rows)
}