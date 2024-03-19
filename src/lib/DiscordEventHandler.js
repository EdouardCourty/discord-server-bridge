import { Client } from "discord.js";

export default class {
    #eventName;
    #client;

    constructor(client, eventName) {
        this.#client = client;
        this.#eventName = eventName;
    }

    /**
     * @returns {Client}
     */
    getClient() {
        return this.#client;
    }

    getEventName() {
        return this.#eventName;
    }

    async handle() {
        throw new Error('Please implement the handle function in ' + this.constructor.name);
    }
}
