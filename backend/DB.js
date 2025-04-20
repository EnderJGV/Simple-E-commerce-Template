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
            `
            SELECT 
                p.cd_produto AS cdProduto,
                p.nome AS nome,
                c.nome AS categoria,
                p.imagem AS imagem
            FROM 
                produto p
            INNER JOIN 
                categoria c
            ON
                p.cd_categoria = c.cd_categoria
            `
        )
        return results;
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

  insertProduct = async (params) => {
    try {
        const result = this.connection.query(
            'INSERT INTO Produto (nome, descricao, preco, cd_categoria, imagem) VALUES (?,?,?,?,?)',
            [
                params.nome,
                params.descricao ?? '',
                params.preco ?? 0,
                params.cdCategoria,
                params.imagem ?? ''
            ]
        )

        return result;
    } catch(error) {
        throw new Error('Houve um erro ao inserir produto' + error);
    }
  }

  insertCategory = async (params) => {
    try {
        const [result] = await this.connection.query('INSERT INTO Categoria (nome,imagem,estado) VALUES (?,?,?)', [
            params.nome,
            params.imagem ?? null,
            params.status ?? 'inativo'
        ]);

        if(result.affectedRows === 0) {
            throw new Error('Erro Desconhecido.')

        } 

        return {
            nome: params.nome,
            imagem: params.image,
            status: params.status,
            cdCategoria: result.insertId
        }
    } catch(error) {
        throw new Error('Houve um erro ao criar categoria' + error)
    }
  }

  getCategories = async () => {
    try {
        const [rows] = await this.connection.query('SELECT cd_categoria AS cdCategoria, nome, imagem FROM Categoria');
        return rows;
    }catch(error) {
        throw error;
    }
  }

  deleteProduct = async(cdProduto) => {
    try {
        const [affectedRows] = await this.connection.query('DELETE FROM Produto WHERE cd_produto = (?)',[cdProduto]);
        if(affectedRows === 0) {
            throw new Error('Produto não encontrado');
        }
        return;
    } catch(error) {
        throw error;
    }
  }
}

export default new DB();