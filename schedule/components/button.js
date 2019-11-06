
class Button {
    constructor(id, onclick) {
        this.id = id;
        this.onclick = onclick;

        // Main container
        this.container = document.createElement('button');
        this.container.id = this.id;
        this.container.classList.add('base-button');

        // Listeners
        this.container.addEventListener('click', onclick);
        this.container.addEventListener('mousedown', (e) => { e.stopPropagation() });
    }
}

class DeleteButton extends Button {
    constructor(id, onclick) {
        super(id, onclick);
        this.container.classList.add('delete');
        const img = document.createElement('img');
        img.src = '/images/x.svg';
        this.container.appendChild(img);
    }
}

class AddButton extends Button {
    constructor(id, onclick) {
        super(id, onclick);
        this.container.classList.add('add');
        const img = document.createElement('img');
        img.src = '/images/plus.svg';
        this.container.appendChild(img);
    }
}

export { DeleteButton, AddButton }