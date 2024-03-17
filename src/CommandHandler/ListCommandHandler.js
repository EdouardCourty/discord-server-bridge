import DiscordCommandHandler from "../lib/DiscordCommandHandler.js";
import {CommandInteraction} from "discord.js";
import ChannelStore from "../Service/ChannelStore.js";

export default class extends DiscordCommandHandler {
    constructor(client) {
        super(client, 'list', 'Shows a list of all the currently linked guilds.');
    }

    /**
     * @param {CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async handle(interaction) {
        const channelGuildsList = ChannelStore.getChannels().map((channel) => {
            return {
                name: channel.guild.name,
                value: '<#' + channel.id + '>'
            };
        });

        let hasChannels = true;

        if (channelGuildsList.length === 0) {
            hasChannels = false;

            channelGuildsList.push({
                name: 'There are currently no channels in the multi-server bridge.',
                value: 'Please use the /link command in the channels you wish to link.'
            });
        }

        await interaction.reply({
            embeds: [{
                title: 'Linked guilds & text channels',
                description: hasChannels ? 'Use the /link command to add channels to the bridge.' : null,
                color: 0x8a01d9,
                fields: channelGuildsList,
                timestamp: new Date()
            }]
        });
    }
}
