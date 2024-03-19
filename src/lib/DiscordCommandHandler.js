import { Client } from "discord.js";

export default class {
    #client;
    #name;
    #description;
    /**
     * @type {{name: string, description: string}[]}
     */
    #subcommands = [];

    constructor(client, name, description) {
        this.#client = client;
        this.#name = name;
        this.#description = description;
    }

    configure() {
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

    addSubCommand(name, description) {
        this.#subcommands.push({
            name, description
        });

        return this;
    }

    getSubCommands() {
        return this.#subcommands;
    }

    /**
     * @returns {Promise<void>}
     */
    async handle() {
        throw new Error('Please implement the handle function in ' + this.constructor.name);
    }
}
