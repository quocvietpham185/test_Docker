import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'testConnect',
    password: '12345678',
    port: 5432,
  });

export default pool;