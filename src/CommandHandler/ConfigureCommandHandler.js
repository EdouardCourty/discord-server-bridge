import DiscordCommandHandler from "../lib/DiscordCommandHandler.js";
import {
    ActionRowBuilder,
    CommandInteraction,
    PermissionFlagsBits,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from "discord.js";
import Configuration from "../Service/Configuration.js";

export default class extends DiscordCommandHandler {
    constructor(client) {
        super(client, 'configure', 'Opens the configuration menu for the current bridge channel.');
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

        const currentChannelConfig = Configuration.getChannelConfiguration(interaction.channel.id);

        if (!currentChannelConfig) {
            return interaction.reply({
                content: 'This channel is not configured as a bridge channel.',
                ephemeral: true
            });
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId('configuration')
            .setPlaceholder('Configure this channel')
            .setMaxValues(2)
            .setMinValues(0)
            .addOptions([
                new StringSelectMenuOptionBuilder()
                    .setLabel('Allow mentions')
                    .setDescription('Does not include `@here` and `@everyone` mentions')
                    .setDefault(currentChannelConfig['allow_mentions'])
                    .setValue('allow_mentions')
                    .setEmoji('📢'),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Allow files & images')
                    .setDescription('Forwards images & files shared from other channels.')
                    .setDefault(currentChannelConfig['allow_files'])
                    .setValue('allow_files')
                    .setEmoji('🖼️')
            ]);

        const actionRowBuilder = new ActionRowBuilder().addComponents(menu);
        const interactionResponse = await interaction.reply({
            components: [actionRowBuilder],
            ephemeral: true
        });

        try {
            const componentResponse = await interactionResponse.awaitMessageComponent({
                filter: (i) => i.user.id === interaction.user.id,
                time: 60_000
            });

            const newConfig = {
                allow_files: componentResponse.values.includes('allow_files'),
                allow_mentions: componentResponse.values.includes('allow_mentions')
            };

            Configuration.updateChannelConfiguration(interaction.channel.id,  {...currentChannelConfig, ...newConfig});

            await interaction.editReply({
                content: 'The configuration has been updated.',
                components: [],
                ephemeral: true
            });
        } catch (e) {
            await interaction.editReply({
                content: 'No response received within 1 minute, cancelling.',
                components: []
            });
        }
    }
}
