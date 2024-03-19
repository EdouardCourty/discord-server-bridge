import { CommandInteraction } from "discord.js";

import DiscordEventHandler from "../lib/DiscordEventHandler.js";
import CommandLoader from "../Service/CommandLoader.js";
import Logger from "../Service/Logger.js";

export default class extends DiscordEventHandler {
    constructor(client) {
        super(client, 'interactionCreate');
    }

    /**
     * @param {CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async handle(interaction) {
        CommandLoader.resolveCommandHandler(interaction.commandName).handle(interaction)
            .then()
            .catch((error) => {
                Logger.error(error);

                interaction.reply({
                    content: 'Something went wrong, please try again later.',
                    ephemeral: true
                })
            });
    }
}
