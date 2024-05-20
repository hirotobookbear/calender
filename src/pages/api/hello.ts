

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};


const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'aojtg2a2',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  ssl: ((process.env.DB_SSL && process.env.DB_SSL.toLowerCase() == 'true') || false)
    ? { rejectUnauthorized: false } : false,
});



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
 
) {
  // res.status(200).json({ name: "John Doe" });
  const client = await pool.connect();
  const ret = await client.query('select * from tests', []);
  await client.release(true);

  res.status(200).json(ret.rows);
}
