class Notifications {
    static container = null;

    colors = {
        error: '#f85747',
        success: '#62d25e',
        info: '#67bcf5',
    }

    constructor() {
        Notifications.container = document.getElementById('notifications');
    }

    removeNotification(node){
        node.animate(
            [
                { transform: 'translateX(0)', opacity: 1 },
                { transform: 'translateX(100%)', opacity: 0 }
            ],
            { duration: 200, easing: 'ease-in' }
        ).onfinish = () => node.remove();
    }
    
    addNotification(title, text, {duration = 10000, closable = true, color = 'info' } = options) {
        const notificationBox =  document.createElement('div');
        const closeButton = document.createElement('button');
        const header = document.createElement('div');
        const body = document.createElement('div');
        header.className = 'notification-title';
        body.className = 'notification-message';
        closeButton.classList = 'notification-btn-close'
        notificationBox.className = 'notificationBox';
        closeButton.innerText = 'X';
        closeButton.onclick = () => { 
            this.removeNotification(notificationBox);
        };
        header.textContent = title;
        body.textContent = text;
        if(closable || (!closable && !duration)) header.appendChild(closeButton)

        header.style.backgroundColor = this.colors[color];
        notificationBox.appendChild(header);
        notificationBox.appendChild(body);

        notificationBox.animate(
            [
                { transform: 'translateX(100%)', opacity: 0 },
                { transform: 'translateX(0)', opacity: 1 }
            ],
            { duration: 300, easing: 'ease-out' }
        );

        Notifications.container.appendChild(notificationBox);

        if (duration) {
            let timeoutId = setTimeout(()=> { 
                this.removeNotification(notificationBox)
            }, duration);
            notificationBox.onmouseenter = () => { 
                clearTimeout(timeoutId)
            }
            notificationBox.onmouseleave = () => {
                timeoutId = setTimeout(()=> { 
                    this.removeNotification(notificationBox)
                }, duration) 
            }
        }
    }
}

export default Notifications;