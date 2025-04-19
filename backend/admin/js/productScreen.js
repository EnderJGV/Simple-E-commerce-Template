import Notifications from "./Notifications.js";
const form = document.getElementById('productForm');
const btnCadastrar = document.getElementById('btnCadastro');
var notificationSystem = null;
document.addEventListener('DOMContentLoaded', () => {
    fillCategories()
    loadProductsTable()
    notificationSystem = new Notifications();
});


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

function createRows(data, columns) {
    const row = document.createElement('tr');

    columns.forEach((column) => {
        const cell = document.createElement('td');
        cell.textContent = data[column];
        row.appendChild(cell);
    });
    return row;
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
            const row = createRows(product, columns);
            table.appendChild(row);
        });
    } catch(error) {
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

