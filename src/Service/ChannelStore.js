import { TextChannel, Guild } from "discord.js";

import Configuration from "./Configuration.js";
import Logger from "./Logger.js";

export default class {
    /** @param {Map<string, TextChannel>} */
    static #channelMap;

    static async init(client) {
        this.#channelMap = new Map();

        for (const channelId of Configuration.getChannelIds()) {
            const channel = await client.channels.fetch(channelId).catch();
            Logger.info('Found channel: ' + channel.name + ' on ' + channel.guild.name);
            this.#channelMap.set(channelId, channel);
        }
    }

    /**
     * @param {TextChannel} channel
     */
    static addChannel(channel) {
        const channelConfiguration = this.getDefaultChannelConfiguration(channel);
        Configuration.updateChannelConfiguration(channel.id, channelConfiguration);

        this.#channelMap.set(channel.id, channel);
    }

    static getDefaultChannelConfiguration(channel) {
        return {
            'guild_id': channel.guild.id,
            'allow_mentions': false,
            'allow_files': false
        };
    }

    /**
     * @param {string} channelId
     */
    static removeChannel(channelId) {
        const config = Configuration.getConfiguration();
        delete config['channels'][channelId];

        Configuration.updateConfiguration(config);

        this.#channelMap.delete(channelId);
    }

    /**
     * @param {Guild} guild
     */
    static removeChannelByGuild(guild) {
        const config = Configuration.getConfiguration();

        Object.entries(config['channels']).forEach(([channelId, configData]) => {
            if (configData['guild_id'] === guild.id) {
                this.removeChannel(channelId);
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
