function createRequirement(parent, item) {
    const div = document.createElement('div');
    div.innerText = item.name;
    parent.appendChild(div);
    return 'foo';
}

export { createRequirement };

