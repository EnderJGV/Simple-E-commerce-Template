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