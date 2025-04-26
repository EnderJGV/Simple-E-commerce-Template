import express from 'express';
import { configDotenv } from 'dotenv';
import DB from './DB.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

const app = express();
const __dirname = path.resolve();
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use(express.static(path.join(__dirname, '../frontend/public')))
app.use(express.json({ limit: '20mb' }));

const { SERVER_PORT, SECRET, UPLOADS_PATH } = configDotenv().parsed;
app.use(UPLOADS_PATH, express.static(path.join(__dirname, UPLOADS_PATH)));

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) return res.status(401).end();
        req.userId = decoded.userId;
        next();
    })
}

async function saveImage(imageBase64) {
    const matches = imageBase64.match(/^data:image\/(\w+);base64,/);
    const extension = matches ? matches[1] : 'png';
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `${Date.now()}.${extension}`;
    const uploadPath = path.join(__dirname, UPLOADS_PATH, fileName);
    await fs.promises.writeFile(uploadPath, buffer);
    const imagePath = `${UPLOADS_PATH}/${fileName}`;
    return {
        name: fileName,
        imagePath: imagePath,
    };
}
async function deleteProduct(cdProduto) {
    try {
        const images = DB.getImageByCdProduto(cdProduto);
  
        const deleteImagePromises = images.map(img => {
        const filePath = path.join(__dirname, img.caminho);
        return fs.unlink(filePath).catch(error => {
            console.error(`Erro ao deletar a imagem ${img.caminho}:`, error);
        });
    });
  
      await Promise.all(deleteImagePromises);
      DB.deleteProduct(cdProduto);
      return;
    } catch (error) {
      throw error;
    }
  }

async function saveAllImages(images, cdProduto) {
    const imgs = Array.isArray(images) ? images : [images];
    await Promise.all(
            imgs.map(async (image) => {
                const {name, imagePath} = await saveImage(image, cdProduto);
                await DB.insertImage(name, imagePath, cdProduto)
            }),
    );
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

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
});

app.post('/user/updateUser', async (req,res) => {
    try {
        const {userName, userLastName, userEmail, userAdress, userPassword, userNewPassWord} = req.body || {};
        const  payload = {
            nome: userName,
            sobrenome: userLastName,
            email: userEmail,
            endereco: userAdress,
            senha: userNewPassWord,
        }
        const response = await DB.updateUser()
    } catch {

    }
})

app.post('/user/register', async (req, res) => {
    try {
        const { userName, userPassword, userEmail, userAddress, userLastName } = req.body || {};
        if( !userName || !userPassword || !userEmail ) {
            return res.json({
                error: true,
                message: 'Um ou mais campos obrigatórios não foram informados. Verfique os dados digitados e tente novamente',
            });
        }
       const result = await DB.insertUser(userName, userLastName, userPassword, userEmail, userAddress);

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

app.get('/login', async (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../frontend/public/login.html'));
})

app.get('/user/profile', async(req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../frontend/public/account.html'));
})
// Admin
app.get('/admin', (req,res) => {
    res.sendFile(path.join(__dirname, 'admin/index.html'));
})

app.get('/admin/createProduct', (req,res) => {
    res.sendFile(path.join(__dirname, 'admin/createProduct.html'));
})

app.get('/admin/createCategory', (req,res) => {
    res.sendFile(path.join(__dirname, 'admin/createCategory.html'));
})

// API
app.post('/api/createCategory', async (req,res) => {
    try{
        const { name, image, status } = req.body || {};

        if(!name) {
            throw new Error('Nome da categoria não informado');
        }

        const result = await DB.insertCategory({
            nome: name,
            imagem: image ?? '',
            status: status ?? '',
        });

        res.status(200).send({
            error: false,
            category: result,
        });
    } catch(error) {
        res.status(200).send({
            error: true,
            message: error.message
        });
    }
});

app.post('/api/createProduct', async (req, res) => {
    try {
        const product = req.body || {};
        if (!product.name || !product.category || !product.quantity) {
            throw new Error("Nome, quantidade ou categoria do produto não foram informados");
        }

        const { cdProduto } = await DB.insertProduct({
            nome: product.name,
            descricao: '',
            quantidade: product.quantity,
            preco: product.price,
            cdCategoria: product.category,
        });

        if (product.images) {
           await saveAllImages(product.images, cdProduto)
        }
    
        res.status(200).send({
            error: false,
            product
        });

    } catch (error) {
        res.status(200).send({
            error: true,
            message: error.message
        });
    }
});

app.get('/api/products', async (req,res) => {
    try {
        const data = await DB.getProducts();
        res.json({
            error: false,
            data
        })

    }catch(error){
        res.json({
            error: true,
            message: error.message
        })
    }
})

app.get('/api/getCategories', async (req,res)=> {
    try {
        const result = await DB.getCategories();
        
        res.status(200).send({
            error: false,
            data: result
        })

    } catch(error) {
        res.status(200).send({
            error: true,
            message: error.message
        });
    }
})

app.post('/api/deleteProduct', async (req, res) => {
    try {
        const { cdProduto } = req.body || {};
        await deleteProduct(cdProduto)

        res.status(200).send({
            error: false
        });

    } catch (error) {
        res.status(200).send({
            error: true,
            message: error.message
        })
    }
})

app.all('/api/*splat', (req, res) => {
    res.status(404).send({
        error: true,
        message: 'Recurso não encontrado, verifique a url informada'
    });
});

app.get('/*splat', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/public/404Error.html'), (err) => {
        if (err) {
            console.error('Erro ao enviar o arquivo 404Error.html:', err.message);
            res.status(500).send('Erro interno do servidor');
        }
    });
});

app.listen(SERVER_PORT, '0.0.0.0', () => {
    console.log(`O Servidor foi iniciado com sucesso e está escutando a porta ${SERVER_PORT}`);
});