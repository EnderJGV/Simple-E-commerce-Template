import mysql from 'mysql2/promise';
import { configDotenv } from 'dotenv';

const { DB_HOST, DB_PASSWORD, DB_USER, DB_NAME } = configDotenv().parsed;

class DB {
    connection = null;
    constructor (){
        mysql.createConnection({
            host: DB_HOST,
            password: DB_PASSWORD,
            user: DB_USER,
            database: DB_NAME
        }).then((connect) =>{
            this.connection = connect;
        });
    }

  getProducts = async () => {
    try {
        const [ results ] = await this.connection.query(
            'SELECT * FROM produto'
        )
        return {
            error: false,
            data: results,
            pagination: {
                page: 1,
                total: results.length
            }
        };
    } catch(error) {
        throw error;
    }
  }

  insertUser = async (userName, userPassword, userEmail, userAddress = '') => {
    try {
        // @TODO userAddress
        const result = await this.connection.query(
            'INSERT INTO usuario (nome, senha, email) VALUES (?, ?, ?)',
            [userName, userPassword, userEmail]
        )
        return result;
    } catch(error) {
        throw error;
    }
  }

  userLogin = async (userEmail, userPassword) => {
    try {
        const [rows] = await this.connection.query(
            'SELECT id_usuario, nome, email  FROM usuario WHERE email = ? AND senha = ?', 
            [userEmail, userPassword]
        );

        if(rows.length === 0) {
            throw new Error('Usuário não encontrado ou senha incorreta!');
        }

        return rows[0];
    } catch(error) {
        throw error;
    }
  }

}

export default new DB();