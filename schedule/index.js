import config from './config.js';
import App from './app.js';

const app = window.app = new App(config);
app.initialize();