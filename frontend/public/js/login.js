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
        if(!response.error) {
            try {
                sessionStorage.removeItem('user');
                sessionStorage.setItem('user', JSON.stringify({
                    name: response.name,
                    email: response.email,
                    permissions: null,
                    token: response.token
                }));
                window.location.replace('/');
            } catch(e) {
                notification.addNotification('Erro', e.message, { color: 'error' });
            }
        } else {
            notification.addNotification('Erro', response.message, { color: 'error' });
        }
    }
}