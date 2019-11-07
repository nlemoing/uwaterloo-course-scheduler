import { plus, cross } from './icon.js'

class Button {
    constructor(title, onclick = () => {}, classes = [], image = null) {
        this.title = title;
        this.onclick = onclick;

        // Main container
        this.container = document.createElement('button');
        this.container.title = this.title;
        this.container.classList.add('base-button');
        classes.forEach((class_) => { this.container.classList.add(class_); });

        if (image) {
            image.classList.add('button-image');
            this.container.appendChild(image);
        }

        // Listeners
        this.container.addEventListener('click', onclick);
        this.container.addEventListener('mousedown', (e) => { e.stopPropagation() });
    }
}

class DeleteButton extends Button {
    constructor(title, onclick, classes = []) {
        classes.push('delete-button');
        const img = cross()
        super(title, onclick, classes, img);
    }
}

class AddButton extends Button {
    constructor(title, onclick, classes = []) {
        classes.push('add-button');
        const img = plus();
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