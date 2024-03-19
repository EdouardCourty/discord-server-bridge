import { Routes } from "discord-api-types/v10";
import { REST, SlashCommandBuilder, Client, Guild, SlashCommandSubcommandBuilder } from "discord.js";

import fs from "fs";

import DiscordEventHandler from "../lib/DiscordEventHandler.js";
import DiscordCommandHandler from "../lib/DiscordCommandHandler.js";
import Logger from "./Logger.js";

export default class {
    /** @var Map<string, DiscordCommandHandler> */
    static #commandMap;

    static #client;

    /**
     * @param {Client} client
     * @returns {Promise<void>}
     */
    static async loadCommands(client) {
        this.#client = client;
        this.#commandMap = new Map();

        const commandFiles = fs.readdirSync('./src/CommandHandler').filter((file) => {
            return file.endsWith('.js');
        });

        for (const commandFile of commandFiles) {
            const commandModule = (await import('../CommandHandler/' + commandFile)).default;
            /** @type DiscordCommandHandler */
            const command = new commandModule(client);
            command.configure();

            this.#commandMap.set(command.getName(), command);
        }
    }

    /**
     * @returns {Map<string, DiscordCommandHandler>}
     */
    static getCommandMap() {
        return this.#commandMap;
    }

    /**
     * @param interactionName
     * @returns {DiscordCommandHandler}
     */
    static resolveCommandHandler(interactionName) {
        return this.#commandMap.get(interactionName);
    }

    /**
     * @returns {DiscordCommandHandler[]}
     */
    static getCommands() {
        return Array.from(this.getCommandMap().values());
    }

    /**
     * @param {Client} client
     * @returns {Promise<void>}
     */
    static async deployCommands(client) {
        if (!this.#commandMap) {
            await this.loadCommands(client);
        }

        const guilds = await client.guilds.fetch();

        for (let [guildId] of guilds) {
            const guild = await client.guilds.fetch(guildId);

            await this.deployCommandOnGuild(guild);
        }
    }

    /**
     * @param {Guild} guild
     * @returns {Promise<void>}
     */
    static async deployCommandOnGuild(guild) {
        const rest= new REST({
            version: '10'
        }).setToken(process.env.TOKEN);

        const commands = this.getCommands().map((commandHandler) => {
            const commandBuilder = new SlashCommandBuilder()
                .setName(commandHandler.getName())
                .setDescription(commandHandler.getDescription());

            commandHandler.getSubCommands().forEach((subCommand) => {
                const subCommandBuilder = new SlashCommandSubcommandBuilder()
                    .setName(subCommand.name)
                    .setDescription(subCommand.description);

                commandBuilder.addSubcommand(subCommandBuilder);
            });

            return commandBuilder.toJSON();
        });

        rest.put(Routes.applicationGuildCommands(this.#client.user.id, guild.id), {
            body: commands
        }).then(() => {
            Logger.info(`Interactions successfully registered for the ${guild.id} - ${guild.name} server!`);
        }).catch((error) => {
            Logger.error(`Unable to deploy commands on the ${guild.id} - ${guild.name} server. Error: ${error}`);
        });
    }
}
