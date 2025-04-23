class Confirmation {
    static overflow = null;
    constructor() {
        if(!Confirmation.overflow) {
            Confirmation.overflow = document.createElement('div');
            Confirmation.overflow.className = 'overflow';
            Confirmation.overflow.style.display = 'none';
            document.body.appendChild(Confirmation.overflow);
        }
    }

    createWindow(title, message, onCancel, onConfirm) {
        const modal = document.createElement('div');
        modal.className = 'modal';

        const closeModal = () => {
            modal.remove();

            if(Confirmation.overflow.childNodes.length === 0) {
                Confirmation.overflow.style.display = 'none';
            }
        }

        const headerComponent = document.createElement('div');
        headerComponent.className = 'modal-header';
        const titleComponent = document.createElement('span');
        titleComponent.innerText = title;

        headerComponent.appendChild(titleComponent);
        
        const closeButton = document.createElement('button');
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fa-solid fa-xmark';
        closeButton.appendChild(closeIcon);
        closeButton.className = 'modal-close-button';
        closeButton.onclick = closeModal;

        headerComponent.appendChild(closeButton);
        modal.appendChild(headerComponent);

        const bodyComponent = document.createElement('div');
        bodyComponent.innerText = message;
        bodyComponent.className = 'modal-body'

        modal.appendChild(bodyComponent);

        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';

        const btnCancel = document.createElement('button');
        btnCancel.textContent = 'Cancelar';
        btnCancel.className = 'btn-cancel'
        btnCancel.onclick = () => { 
            closeModal(); 
            onCancel(); 
        };

        const btnConfirm = document.createElement('button');
        btnConfirm.textContent = 'Confirmar';
        btnConfirm.className = 'btn-confirm';
        btnConfirm.onclick = () => { 
            closeModal()
            onConfirm();
        };
        modalFooter.appendChild(btnCancel);
        modalFooter.appendChild(btnConfirm);
        modal.appendChild(modalFooter);
        return modal;
    }

    showAlert(title, message, onConfirm = () => {}, onCancel = ()=>{}) {
        const modal = this.createWindow(title, message, onConfirm, onCancel);
        Confirmation.overflow.appendChild(modal);
        Confirmation.overflow.style.display = 'flex';
    }
}

export default Confirmation;