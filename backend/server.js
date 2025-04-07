import express from 'express';
import { configDotenv } from 'dotenv';
import DB from './DB.js';
import jwt from 'jsonwebtoken';
import path from 'path';

const app = express();
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '../frontend')))
app.use(express.json());

const { SERVER_PORT, SECRET } = configDotenv().parsed;

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) return res.status(401).end();
        req.userId = decoded.userId;
        next();
    })
}
app.get('/', (res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.get('/products',verifyToken, async (req,res) => {
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

app.post('/login', async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body || {};
        const user = await DB.userLogin(userEmail, userPassword);
        const { id_usuario, email, nome } = user;
        const token = jwt.sign({user:{id_usuario, email, nome}}, SECRET, { expiresIn: 1800});

        return res.json({
            auth: true,
            token,
        })

    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
})

app.post('/user/register', async (req, res) => {
    try {
        const { userName, userPassword, userEmail, userAddress } = req.body || {};
        if( !userName || !userPassword || !userEmail ) {
            return res.json({
                error: true,
                message: 'Um ou mais campos obrigatórios não foram informados. Verfique os dados digitados e tente novamente',
            });
        }
       const result = await DB.insertUser(userName, userPassword, userEmail, userAddress);

       if(result.rowsAffected === 1) {
         return res.status(200).json({
            error: false, 
            message: 'Usuário cadastrado com sucesso',
         })
       }

    } catch(error) {
        if(error.code && error.code === 'ER_DUP_ENTRY') {
            return res.status(403).json({
                error: true,
                message: 'Email já cadastrado'
            });
        }

        return res.json({
            error: true,
            message: error.message
        });
    }
})

app.listen(SERVER_PORT, () => {
    console.log(`O Servidor foi iniciado com sucesso e está escutando a porta ${ SERVER_PORT }`);
})