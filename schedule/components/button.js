
class Button {
    constructor(title, onclick, classes = [], image) {
        this.title = title;
        this.onclick = onclick;

        // Main container
        this.container = document.createElement('button');
        this.container.title = this.title;
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
    constructor(title, onclick, classes = []) {
        classes.push('delete');
        const img = document.createElement('img');
        img.src = '/images/x.svg';
        super(title, onclick, classes, img);
    }
}

class AddButton extends Button {
    constructor(title, onclick, classes = []) {
        classes.push('add');
        const img = document.createElement('img');
        img.src = '/images/plus.svg';
        super(title, onclick, classes, img);
    }
}

class SubmitButton extends AddButton {
    constructor(title, onclick) {
        super(title, onclick);
        this.container.type = 'submit';
    }
}

class CancelButton extends DeleteButton {
    constructor(title, onclick) {
        super(title, onclick);
        this.container.type = 'reset';
    }
}

export { DeleteButton, AddButton, SubmitButton, CancelButton }