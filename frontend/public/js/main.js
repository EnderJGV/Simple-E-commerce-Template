window.addEventListener('scroll',function(){
    const header = document.querySelector('.header_content');
    const header_desconto = document.querySelector('.text_desconto');
    header.classList.toggle('sticky', window.scrollY) > 0;
    header_desconto.classList.toggle('sticky', window.scrollY) > 0;
});

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

// Atualiza a cada segundo
const interval = setInterval(updateCountdown, 1000);
updateCountdown(); // Atualiza imediatamente ao carregar



    