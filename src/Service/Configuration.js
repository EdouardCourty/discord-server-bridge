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

    static getChannelIds() {
        return Object.keys(this.getConfiguration()['channels'] ?? {});
    }

    static getChannelConfiguration(channelId) {
        return this.getConfiguration()['channels'][channelId];
    }

    static updateChannelConfiguration(channelId, configuration) {
        const newConfig = this.getConfiguration();
        newConfig['channels'][channelId] = configuration;

        this.updateConfiguration(newConfig);
    }

    static updateConfiguration(configObject) {
        this.#configuration = configObject;

        fs.writeFileSync('./data/configuration.json', JSON.stringify(configObject, null, 2));
    }
}
