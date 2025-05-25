document.addEventListener("DOMContentLoaded", loadProductInfo);

 async function loadProductInfo() {
 const { data } = await getProduct();
 const product = data[0];
 fillForm(product);
}

function fillForm(product) {
    document.getElementById("product-name").innerText = product.nome
    document.getElementById("product-price").innerText = "R$ " + product.preco
    document.getElementById("product-description").innerText = product.descricao
    const imgTumbeNail = document.getElementsByClassName("img-thumbnail")

    const img = product.imagens === null ? [] : product.imagens.split(";")
        document.getElementsByClassName('product-img')[0].src = img[0];
    for(i = 1; i < 5; i++ ){
        imgTumbeNail[i].src = img[i] ?? null;
    }
}
 
 function getProduct(){
    return new Promise((resolve, reject)=> {
        const productId = new URLSearchParams(window.location.search).get('id');
        const http = new XMLHttpRequest();
    http.open('GET', `/api/product/${productId}`);
    http.send();
    http.onload = () => {
        const parsedResponse = JSON.parse(http.response);
        if(parsedResponse.error == true){
            reject(parsedResponse.message);
        }else{
            resolve(parsedResponse);
        }
    }
    })
    
 }