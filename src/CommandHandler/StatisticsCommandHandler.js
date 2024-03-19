import {Colors, CommandInteraction} from "discord.js";

import DiscordCommandHandler from "../lib/DiscordCommandHandler.js";
import ChannelStore from "../Service/ChannelStore.js";

export default class extends DiscordCommandHandler {
    constructor(client) {
        super(client, 'stats', 'Shows statistics about the bot');
    }

    /**
     * @param {CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async handle(interaction) {
        await interaction.reply({
            embeds: [{
                title: 'Statistics',
                fields: [
                    { name: 'Uptime', value: Math.round(this.getClient().uptime / 1000) + ' seconds', inline: true },
                    { name: 'Ping', value: this.getClient().ws.ping + ' ms', inline: true},
                    { name: 'Linked servers', value: ChannelStore.getChannelMap().size, inline: true}
                ],
                color: Colors.Gold,
                timestamp: new Date()
            }]
        });
    }
}
