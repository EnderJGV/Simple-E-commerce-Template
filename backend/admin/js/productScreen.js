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

function handleFileSelection(input) {
    const file = input.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onload = (e)=> {
            const imgUrl = e.currentTarget.result;
            inputFile.style.backgroundImage = `url(${imgUrl})`;
            inputFile.style.backgroundSize = 'cover';
            inputFile.style.backgroundPosition = 'center';
            inputFile.style.backgroundRepeat = 'no-repeat';
        }

        reader.readAsDataURL(file);
    }

}

function inputFileClick() {
    const input = document.querySelector('input[type=file]');
    input.addEventListener('change',() => handleFileSelection(input), false);
    input.click();
}


btnCadastrar.onclick = async (event) => {
    event.preventDefault();

    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries());

    if (!data.nome || !data.quantidade || !data.preco || !data.categoria) {
        notificationSystem.addNotification(
            'Preencha todos os campos',
            'Nome, preço e quantidade do produto devem ser preenchidos.',
            {color: 'info'}
        );
        return;
    }

    const params  = {
        name: data.nome,
        //description: 
        price: data.preco,
        quantity: data.quantidade,
        category: data.categoria,
        // image:
    }
    try {
        await createProduct(params);
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

