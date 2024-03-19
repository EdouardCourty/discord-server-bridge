import { Guild } from "discord.js";

import DiscordEventHandler from "../lib/DiscordEventHandler.js";
import ChannelStore from "../Service/ChannelStore.js";

export default class extends DiscordEventHandler {
    constructor(client) {
        super(client, 'guildDelete');
    }

    /**
     * @param {Guild} guild
     * @returns {Promise<void>}
     */
    async handle(guild) {
        ChannelStore.removeChannelByGuild(guild);
    }
}
