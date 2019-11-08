import { AddButton } from './button.js';

class AddableList {
    constructor(id, onsubmit, addButtonTitle = 'Add') {
        this.onsubmit = onsubmit;
        
        // Main container
        this.container = document.createElement('div');
        this.container.id = id;
        this.container.classList.add('addable-list');

        // Add button
        this.addButton = new AddButton(addButtonTitle, this.addDraft.bind(this));
        this.container.appendChild(this.addButton.container);
    }

    addDraft() {
        const draft = new Draft(this.onsubmit);
        this.add(draft.container);
        draft.focus();
    }

    add(element) {
        this.container.insertBefore(element, this.addButton.container);
    }
}

const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

class Draft {
    constructor(onsubmit) {
        console.log(onsubmit);
        this.onsubmit = onsubmit;

        this.container = document.createElement('div');
        this.container.classList.add('draft');

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.addEventListener('focusout', this.submission.bind(this));
        this.input.addEventListener('keyup', this.escape.bind(this));
        this.container.appendChild(this.input);
    }

    submission() {
        const name = this.input.value;
        if (name) {
            this.onsubmit(name);
        }
        this.container.remove();
    }

    escape({ keyCode, }) {
        if (keyCode === ENTER_KEY || keyCode === ESCAPE_KEY) {
            this.input.blur();
        }
    }

    focus() {
        this.input.focus();
    }
}

export { AddableList }