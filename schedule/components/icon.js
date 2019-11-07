const xmlns = 'http://www.w3.org/2000/svg';

/**
 * Create a basic 24x24 SVG element
 */
function makeSvg() {
    const svg = document.createElementNS(xmlns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    return svg;
}

/**
 * Create an svg with the given path.
 * @param {string} path 
 */
function pathIcon(path) {
    const svg = makeSvg();
    const pathElement = document.createElementNS(xmlns, 'path');
    pathElement.setAttribute('d', path);
    svg.appendChild(pathElement);
    return svg;
}

function plus() {
    return pathIcon('M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z');
}

function cross() {
    return pathIcon('M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z');
}

export { plus, cross }