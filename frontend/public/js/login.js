const http = new XMLHttpRequest();
const notification = new Notifications();

const form = document.getElementById('login-form');
function printForm(e) {
    e.preventDefault();
    const { email, senha } = Object.fromEntries(new FormData(form).entries());
    http.open('POST','/login');
    http.setRequestHeader('Content-Type', 'application/json');
    http.send(JSON.stringify({
        userEmail: email,
        userPassword:  senha
    }));
    http.onload = async () => {
        const response = JSON.parse(http.response);
        if(!response.error && response.status === 200) {
            await sessionStorage.setItem('user', http.response);
        } else {
            notification.addNotification('Erro', response.message, { color: 'error' });
        }
    }
}