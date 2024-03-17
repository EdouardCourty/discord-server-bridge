export default class {
    static #log(level, message) {
        console.log(JSON.stringify({
            level: level,
            content: message,
            timestamp: Math.round(Date.now() / 1000)
        }));
    }

    static info(message) {
        this.#log('info', message);
    }

    static error(message) {
        this.#log('error', message);
    }
}
