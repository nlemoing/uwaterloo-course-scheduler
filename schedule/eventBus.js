class EventBus {
    constructor() {
        this._listeners = {};
    }

    on(eventName, listener) {
        if (!(eventName in this._listeners)) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(listener);
    }

    dispatch(eventName, ...args) {
        const listeners = this._listeners[eventName];
        if (!listeners || listeners.length === 0) {
            return;
        }
        listeners.slice(0).forEach((listener) => { 
            listener(...args);
        })
    }
}

export { EventBus };