import DiscordCommandHandler from "../lib/DiscordCommandHandler.js";
import {CommandInteraction, PermissionFlagsBits} from "discord.js";
import ChannelStore from "../Service/ChannelStore.js";

export default class extends DiscordCommandHandler {
    constructor(client) {
        super(client, 'link', 'Links this channel to be part of the multi-server bridge.');
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async handle(interaction) {
        if (false === interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({
                content: 'You cannot execute this command.',
                ephemeral: true
            });
        }

        ChannelStore.addChannel(interaction.channel);

        await interaction.reply({
            content: 'This channel was successfully added to the multi-server bridge. Have fun!',
            ephemeral: true
        });
    }
}
