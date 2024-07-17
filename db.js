import { query } from 'express';
import pg from 'pg'
const { Pool } = pg;

const pool = new Pool({
    user: 'postgres',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'm7_d6_db_always_music_v2'
});

export default pool;