import { Client } from "discord.js";

export default class {
    #client;
    #name;
    #description;

    constructor(client, name, description) {
        this.#client = client;
        this.#name = name;
        this.#description = description;
    }

    /**
     * @returns {Client}
     */
    getClient() {
        return this.#client;
    }

    getName() {
        return this.#name;
    }

    getDescription() {
        return this.#description;
    }

    /**
     * @returns {Promise<void>}
     */
    async handle() {
        throw new Error('Please implement the handle function in ' + this.constructor.name);
    }
}
