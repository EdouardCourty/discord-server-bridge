import { CommandInteraction, PermissionFlagsBits } from "discord.js";

import DiscordCommandHandler from "../lib/DiscordCommandHandler.js";
import ChannelStore from "../Service/ChannelStore.js";

export default class extends DiscordCommandHandler {
    constructor(client) {
        super(client, 'unlink', 'Removes this channel from the multi-server bridge.');
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

        ChannelStore.removeChannel(interaction.channel.id);

        await interaction.reply({
            content: 'This channel was removed from the multi-server bridge.',
            ephemeral: true
        });
    }
}
