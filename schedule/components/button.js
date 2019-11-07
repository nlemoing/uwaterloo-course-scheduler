
class Button {
    constructor(id, onclick, classes = [], image) {
        this.id = id;
        this.onclick = onclick;

        // Main container
        this.container = document.createElement('button');
        this.container.id = this.id;
        this.container.classList.add('base-button');
        classes.forEach((class_) => { this.container.classList.add(class_); });

        if (image) {
            image.classList.add('button-image');
            const imageContainer = document.createElement('span');
            imageContainer.classList.add('button-image-container');
            imageContainer.appendChild(image);
            this.container.appendChild(imageContainer);
        }

        // Listeners
        this.container.addEventListener('click', onclick);
        this.container.addEventListener('mousedown', (e) => { e.stopPropagation() });
    }
}

class DeleteButton extends Button {
    constructor(id, onclick, classes = []) {
        classes.push('delete');
        const img = document.createElement('img');
        img.src = '/images/x.svg';
        super(id, onclick, classes, img);
    }
}

class AddButton extends Button {
    constructor(id, onclick, classes = []) {
        classes.push('add');
        const img = document.createElement('img');
        img.src = '/images/plus.svg';
        super(id, onclick, classes, img);
    }
}

export { DeleteButton, AddButton }