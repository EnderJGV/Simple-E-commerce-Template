const form = document.getElementById('productForm');
const btnCadastro = document.getElementById('btnCadastro');

btnCadastro.onclick = async (event) => {
    event.preventDefault();

   const formData = new FormData(form);
   const data = Object.fromEntries(formData.entries());

   const param = {
    name: data.nome,
    status: data.status,
    image: ''
   }

   createCategory(param);
};

async function createCategory(param) {
    try {
        const data = await fetch('/api/createCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(param)
           });
        
           if (!data.ok) {
            const response = await data.json();
            throw new Error(response.message || 'Erro desconhecido');
           }
        
           const response = await data.json();
           if(response.error) {
            throw new Error(response.message);
           }
    } catch (error) {
        alert(error.message)
    }
}