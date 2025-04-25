import Notifications from "./Notifications.js";
import Confirmation from "./Confirmation.js";

const form = document.getElementById('productForm');
const btnCadastrar = document.getElementById('btnCadastro');
const inputFile = document.getElementById('product-image-input');
inputFile.addEventListener('click',inputFileClick)

var notificationSystem = new Notifications();
var modalSystem = new Confirmation();
document.addEventListener('DOMContentLoaded', () => {
    fillCategories()
    loadProductsTable()
});

function renderProductsImage(imageBase64, fileName, fileSize, fileType) {
    const container = document.querySelector('div[class=product-images-container]');
    const row = document.createElement('div');
    const text = document.createElement('span');
    const img = document.createElement('img');
    row.style.display = 'flex';
    row.style.alignItems = 'center';

    const fileSizeKB = (fileSize / 1024).toFixed(2);
    text.innerText = `${fileName} - ${fileSizeKB} KB - ${fileType}`;
    text.style.fontSize = 'xx-small';
    img.src = `${imageBase64}`;
    img.style.width = '20px';
    img.style.height = '20px';
    row.appendChild(img)
    row.appendChild(text);
    container.appendChild(row);
}

function handleFileSelection(input) {
    
    const files = input.files;
    for ( const file  of files) {
        const reader = new FileReader();
            reader.onload = (e)=> {
                renderProductsImage(e.currentTarget.result, file.name, file.size, file.type);
            }
        reader.readAsDataURL(file);
    }
}

function inputFileClick() {
    const input = document.querySelector('input[type=file]');
    input.addEventListener('change',() => handleFileSelection(input), false);
    input.click();
}


function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

btnCadastrar.onclick = async (event) => {
    event.preventDefault();

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries());
    let image = '';

    if (!data.nome || !data.quantidade || !data.preco || !data.categoria) {
        notificationSystem.addNotification(
            'Preencha todos os campos',
            'Nome, preço e quantidade do produto devem ser preenchidos.',
            {color: 'info'}
        );
        return;
    }

    if(data.image) {
        image = await readFileAsBase64(data.image);
    }

    const params  = {
        name: data.nome,
        //description: 
        price: data.preco,
        quantity: data.quantidade,
        category: data.categoria,
        image,
    }

    try {
        await createProduct(params);
        form.reset();
        await loadProductsTable();
        notificationSystem.addNotification('Produto cadastrado', `O Produto ${data.nome} foi cadastrado.`, { color: 'success' });
    } catch(error) {
        notificationSystem.addNotification('Erro', error.message, { color: 'error' });
    }
};

async function fillCategories() {
    const selectComponent = document.querySelector('select[name=categoria]');
    selectComponent.disabled = true;
    const categories = await getCategories();
    if(categories.length === 0) {
        selectComponent.innerHTML = '<option value=""> Nenhuma categoria disponível </option>';
    }
    selectComponent.innerHTML = '';
    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.cdCategoria;
        option.textContent = category.nome;
        selectComponent.appendChild(option);
    });
    selectComponent.disabled = false;
}

async function getCategories() {
    try{
        const response = await fetch('/api/getCategories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro desconhecido');
        }

        const result = await response.json();

        if(result.error) {
            throw new Error(result.message)
        }

        return result.data;
    } catch (error) {
        notificationSystem.addNotification(error.message);
    }
}

function createActionButton(icon = '', action = ()=>{}, color = 'black') {
    const button = document.createElement('button');
    const img = document.createElement('i');
    img.className = icon;
    img.style.color = color;
    button.appendChild(img);
    button.onclick = () => { action() };
    return button;
}

function createRows(data, columns, buttons = [{}]) {
    const row = document.createElement('tr');

    columns.forEach((column) => {
        const cell = document.createElement('td');
        cell.textContent = data[column];
        row.appendChild(cell);
    });
    if(buttons) {
        const cell = document.createElement('td');
        buttons.forEach((button) => {
            cell.appendChild(createActionButton(button.icon, button.action, button.color))
        })
        row.appendChild(cell);
    }

    return row;
}

async function deleteProductById(cdProduto) {
    try {
        const response = await fetch('/api/deleteProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cdProduto: cdProduto })
        })

        if(!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
        }

        const data = await response.json();

        if(data.error) {
            throw new Error(data.message);
        }

        notificationSystem.addNotification(
            'Produto deletado',
            'Produto deletado com sucesso',
            { color: 'success'}
        );

        loadProductsTable();
    } catch(error) {
        notificationSystem.addNotification(
            'Erro',
            `Erro ao deletar produto. ${error.message}`,
            { color: 'error'}
        );
    }
}

function removeProduct(product) {
    modalSystem.showAlert(
        'Deletar Produto?',
        `Deseja deletar o produto ${product.nome}?`,
        () => {},
        () => {deleteProductById(product.cdProduto)}
    );
}

async function loadProductsTable() {
    try {
        const table = document.querySelector('tbody[id=table-products]')
        table.innerHTML = '';
        const columns = ['cdProduto', 'nome', 'categoria'];
        const products = await getProducts();
        if (products.length == 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = 'Nenhum produto encontrado';
            cell.colSpan = columns.length;
            row.appendChild(cell);
            table.appendChild(row);
            return;
        }
        products.forEach((product) => {
            const row = createRows(
                product,
                columns,
                [
                    {
                        icon: 'fa-solid fa-pen',
                        action: () => {
                            console.log('Edit Product clicado')
                        }, 
                        color: '#0089f4'
                    },
                    {   
                        icon: 'fa-solid fa-trash',
                        action: () => {
                            removeProduct(product)
                        },
                        color: 'red'
                    }
                ]);
            table.appendChild(row);
        });
    } catch(error) {
        console.error(error);
        notificationSystem.addNotification('Erro', error.message, { color: 'error'});
    }
}

async function getProducts() {
    try {
        const response = await fetch('/api/products', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Erro desconhecido");
        }

        const result = await response.json();

        if(result.error) {
            throw new Error(result.message);
        } 

        return result.data;
    } catch(error) {
        throw error;
    }
}

async function createProduct(params) {
    try {
        const response = await fetch('/api/createProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        })

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro desconhecido');
        }

        const result = await response.json();

        if (result.error) {
           throw new Error(result.message)
        }
    } catch(error) {
        throw error;
    }
}

