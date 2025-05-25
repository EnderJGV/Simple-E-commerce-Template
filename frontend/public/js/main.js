window.addEventListener('scroll',function(){
    const header = document.querySelector('.header_content');
    const header_desconto = document.querySelector('.text_desconto');
    header.classList.toggle('sticky', window.scrollY) > 0;
    header_desconto.classList.toggle('sticky', window.scrollY) > 0;
});

window.addEventListener('DOMContentLoaded',() => {
    const user = JSON.parse(sessionStorage.getItem('user') || null);
    if(user) {
        const loginLink = document.querySelector('a[href="/login"]');
        const signUpLink = document.querySelector('a[href="/singUp.html"]');
        loginLink.querySelector('span').textContent = user.name;
        loginLink.setAttribute('href', '/user/profile');
        signUpLink.textContent = 'Meu Perfil';
        signUpLink.setAttribute('href', '/user/profile');
    }
    renderProducts();
})

function toggleMenu(){
    menuToggle.classList.toggle('active');
    navigation.classList.toggle('active');
};


// criando o relogio

// Define a data de término: 5 dias a partir de agora
const targetDate = new Date();
targetDate.setDate(targetDate.getDate() + 5);

// Seleciona os elementos na ordem: [Days, Hours, Minutes, Seconds]
const timerSpans1 = document.querySelectorAll('.numeber-timer-bannerday');
const timerSpans2 = document.querySelectorAll('.number-timer');

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        timerSpans1.forEach(span => span.textContent = '00');
        timerSpans2.forEach(span => span.textContent = '00');
        clearInterval(interval); // Para o timer quando acabar
        return;
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const timeValues = [
        String(days).padStart(2, '0'),
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0')
    ];

    // Atualiza os dois conjuntos de spans
    [timerSpans1, timerSpans2].forEach(group => {
        group.forEach((span, index) => {
            span.textContent = timeValues[index];
        });
    });
}

function getProducts() {
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.open('GET','/api/products');
        httpRequest.send();
        httpRequest.onload = () => {
            const response = JSON.parse(httpRequest.response);
            if (response.error) {
                console.error(response.message);
                reject(null);
            } else {
                resolve(response.data.map((product) =>{
                    return {
                        name: product.nome,
                        description: product.descricao,
                        image: product.imagens ? product.imagens.split(';')[0] : null,
                        price: product.preco,
                        category: product.categoria
                    }
                }));
            }
        }
    })
}

async function renderProducts() {
    try {
        const container = document.getElementById('content-card-products');
        const products = await getProducts();

        if (products && products.length > 0) {
            products.forEach(product => {
                container.appendChild(productCardComponent(product));
            })
        } else {
            container.innerHTML =
                "<div class='no-results-text'><span> Nenhum produto encontrado </span></div>";
        }
    } catch (error) {
        const container = document.getElementById('content-card-products');
        container.innerHTML =
            `<div class='no-results-text'>
                <span>
                    Erro ao tentar carregar produtos.
                </span>
            </div>`;
    }
    
}

function productCardComponent({ 
    name, description, image, price, classification, originalPrice, discount
}) {
console.log(image);
const wrapper = document.createElement('div');
wrapper.classList.add('product-card');
const element = `
    <div>
        <div class="descont-product">
            <span>-{discount}%</span>
            <i class="fa-solid fa-heart" id="fa-heart"></i>
            <i class="fa-solid fa-eye" id="fa-eye"></i>
        </div>
        <div class="product-card-img">
            <img src=${image ? image : './img/no-image.png'} alt="produto"  onerror="this.onerror=null; this.src='./img/no-image.png';">
        </div>
        <button class="button-card">Add To Cart</button>
    </div>
    <div class="product-card-text">
        <p>${name}</p>
        <div class="price">
            <span class="principal">R$ ${price}</span>
            <span class="secundario">R$ {originalPrice}</span>
        </div>
        <div class="stars">
            <p>
                <span>★★★★★</span> (+100)
            </p>
        </div>
    </div>
  `;

  wrapper.innerHTML = element;

  return wrapper;
}

// Atualiza a cada segundo
const interval = setInterval(updateCountdown, 1000);
updateCountdown(); // Atualiza imediatamente ao carregar



    