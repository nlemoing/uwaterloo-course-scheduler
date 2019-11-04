async function register (server) {
    server.events.on('response', (request) => {
        const { method, path, response } = request;
        console.log(`${method.toUpperCase()} ${path} ${response.statusCode}`);
    });
}

module.exports = {
    register,
    name: 'logger'
};

