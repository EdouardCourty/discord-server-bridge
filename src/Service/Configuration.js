import fs from "fs";

export default class {
    static #configuration;

    static load() {
        this.#configuration = JSON.parse(fs.readFileSync('./data/configuration.json').toString());
    }

    static getConfiguration() {
        if (!this.#configuration) {
            this.load();
        }

        return this.#configuration;
    }

    static updateConfiguration(configObject) {
        this.#configuration = configObject;

        fs.writeFileSync('./data/configuration.json', JSON.stringify(configObject, null, 2));
    }
}
