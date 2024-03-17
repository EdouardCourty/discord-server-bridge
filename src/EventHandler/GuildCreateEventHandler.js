import DiscordEventHandler from "../lib/DiscordEventHandler.js";
import {Guild} from "discord.js";
import CommandLoader from "../Service/CommandLoader.js";

export default class extends DiscordEventHandler {
    constructor(client) {
        super(client, 'guildCreate');
    }

    /**
     * @param {Guild} guild
     * @returns {Promise<void>}
     */
    async handle(guild) {
        await CommandLoader.deployCommandOnGuild(guild);
    }
}
