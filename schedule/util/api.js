
function API(path, options = {}) {
    const base = 'http://localhost:3000';
    const defaults = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    options = Object.assign(defaults, options);
    const uri = new URL(path, base).href;
    return fetch(uri, options);
}

export default API