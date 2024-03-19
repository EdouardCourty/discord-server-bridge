import {
    ActionRowBuilder,
    CommandInteraction,
    PermissionFlagsBits,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from "discord.js";

import DiscordCommandHandler from "../lib/DiscordCommandHandler.js";
import Configuration from "../Service/Configuration.js";

export default class extends DiscordCommandHandler {
    constructor(client) {
        super(client, 'configure', 'Opens the configuration menu for the current bridge channel.');
    }

    configure() {
        this
            .addSubCommand('show', 'Shows the bridge channel configuration.')
            .addSubCommand('edit', 'Edits the bridge channel configuration.');
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async handle(interaction) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case 'edit':
                return this.#handleEditSubCommand(interaction);
            case 'show':
                return this.#handleShowSubCommand(interaction);
            default:
                break;
        }
    }

    /**
     * @param {CommandInteraction} interaction
     */
    async #handleEditSubCommand(interaction) {
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
            content: 'Please use the following dropdown to change the channel configuration.',
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

    /**
     * @param {CommandInteraction} interaction
     */
    async #handleShowSubCommand(interaction) {
        const channelConfiguration = Configuration.getChannelConfiguration(interaction.channel.id);

        return interaction.reply({
            ephemeral: true,
            embeds: [{
                title: ':link: Bridge channel configuration',
                description: 'Use the `/configure edit` command to modify the configuration.',
                color: 0x8a01d9,
                fields: [
                    {
                        name: 'Files & images reception',
                        value: channelConfiguration['allow_files']
                            ? ':white_check_mark: Allowed'
                            : ':no_entry: Disallowed' },
                    {
                        name: 'User mentions',
                        value: channelConfiguration['allow_mentions']
                            ? ':white_check_mark: Allowed'
                            : ':no_entry: Disallowed'
                    }
                ],
                timestamp: new Date()
            }]
        })
    }
}
