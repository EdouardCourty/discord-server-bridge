import Configuration from "./Configuration.js";
import {TextChannel, Guild} from "discord.js";
import Logger from "./Logger.js";

export default class {
    /** @param {Map<string, TextChannel>} */
    static #channelMap;

    static async init(client) {
        this.#channelMap = new Map();

        const channelIds = Configuration.getConfiguration()['channels'] ?? [];

        for (const channelData of channelIds) {
            const channel = await client.channels.fetch(channelData['id']).catch();
            Logger.info('Found channel: ' + channel.name + ' on ' + channel.guild.name);
            this.#channelMap.set(channelData['id'], channel);
        }
    }

    /**
     * @param {TextChannel} channel
     */
    static addChannel(channel) {
        const config = Configuration.getConfiguration();
        const newChannels = config['channels'].filter((channelData) => channelData['id'] !== channel.id);

        newChannels.push({
            id: channel.id,
            guild_id: channel.guild.id
        });
        config['channels'] = newChannels;

        Configuration.updateConfiguration(config);

        this.#channelMap.set(channel.id, channel);
    }

    /**
     * @param {string} channelId
     */
    static removeChannel(channelId) {
        const config = Configuration.getConfiguration();
        config['channels'] = config['channels'].filter((channelData) => channelData['id'] !== channelId);

        Configuration.updateConfiguration(config);

        this.#channelMap.delete(channelId);
    }

    /**
     * @param {Guild} guild
     */
    static removeChannelByGuild(guild) {
        const config = Configuration.getConfiguration();

        config['channels'].forEach((channelData) => {
            if (channelData['guild_id'] === guild.id) {
                this.removeChannel(channelData['id']);
            }
        });
    }

    /**
     * @return Map<string, TextChannel>
     */
    static getChannelMap() {
        return this.#channelMap;
    }

    /**
     * @returns {Array<TextChannel>}
     */
    static getChannels() {
        return Array.from(this.getChannelMap().values());
    }
}
