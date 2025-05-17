import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { configDotenv } from 'dotenv';

const { DB_HOST, DB_PASSWORD, DB_USER } = configDotenv().parsed;
const __dirname = path.resolve();

async function buildDb() { 
    console.log("*** Estabelecendo conexão com o banco de dados *** \n\n");
    const connection = await mysql.createConnection({
        host: DB_HOST,
        password: DB_PASSWORD,
        user: DB_USER,
        multipleStatements: true,
    });

    try {
        console.log("Buscando script de criação da base de dados em ./sql/Ecommerce.sql\n\n");
        const sql = fs.readFileSync(path.join(__dirname, './sql/Ecommerce.sql'),'utf-8');
        console.log("Criando ou atualizando base de dados Ecommerce \n\n");
        await connection.query(sql);
        console.log('\x1b[32mBanco de dados ecommerce criado/atualizado com sucesso!\x1b[0m\n\n');
    } catch (error) {
        console.error('\n\n\x1b[31mErro ao criar/atualizar banco de dados:\x1b[0m', error.message);
    } finally {
       connection.end();
       process.exit();
    }
}

buildDb();