import express from 'express';
import { configDotenv } from 'dotenv';
import DB from './DB.js';

const app = express();
const { SERVER_PORT } = configDotenv().parsed;

app.get('/products', async (req,res) => {
    try {
        const data = await DB.getProducts();

        return res.json({message: data})
    }catch(error){
        return res.json({
            error: true,
            message: error.message
        })
    }
})

app.listen(SERVER_PORT, () => {
    console.log(`O Servidor foi iniciado com sucesso e está escutando a porta ${ SERVER_PORT }`);
})