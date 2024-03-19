import { Message, MessageType } from "discord.js";

import DiscordEventHandler from "../lib/DiscordEventHandler.js";
import ChannelStore from "../Service/ChannelStore.js";
import Configuration from "../Service/Configuration.js";

export default class extends DiscordEventHandler {
    constructor(client) {
        super(client, 'messageCreate');
    }

    /**
     * @param {Message} message
     */
    async handle(message) {
        if (message.author.bot) {
            return;
        }

        return this.#handleBroadcast(message);
    }

    /**
     * @param {Message} message
     */
    async #handleBroadcast(message) {
        const channelId = message.channel.id;
        const channels = ChannelStore.getChannels();

        if (ChannelStore.getChannelMap().has(channelId)) {
            for (const channel of channels) {
                if (channel.id !== channelId) {
                    const messagePayload = await this.#prepareMessagePayload(channel, message);
                    channel.send(messagePayload).catch();
                }
            }
        }
    }

    async #prepareMessagePayload(channel, message) {
        const channelConfig = Configuration.getChannelConfiguration(channel.id);

        let stringContent = '';

        if (typeof message !== 'string' && message.type === MessageType.Reply) {
            /** @type Message */
            const originMessage = await message.channel.messages.fetch(message.reference.messageId);

            let originMessageContent = originMessage.author.bot
                ? originMessage.content.split('\n').pop()
                : originMessage;

            stringContent += `> ${(await this.#prepareMessagePayload(channel, originMessageContent)).content}\n`;
        }

        if (typeof message !== 'string') {
            stringContent += message.author.bot
                ? this.#prepareMessageContent(message, channelConfig['allow_mentions'])
                : '**' + message.author.globalName + ' [' + message.guild.name + ']** : ' + this.#prepareMessageContent(message, channelConfig['allow_mentions'])
        } else {
            stringContent = message;
        }

        const payload = {
            content: stringContent
        };

        if (channelConfig['allow_files']) {
            payload.files = Array.from(message.attachments.values());
        }

        return payload;
    }

    #prepareMessageContent(message, allowMentions) {
        let newContent = message.content
            .replace('@everyone', 'everyone')
            .replace('@here', 'here');

        if (false === allowMentions) {
            message.mentions.users.forEach((user) => {
                newContent = newContent.replace(`<@${user.id}>`, user.globalName);
            });
        }

        return newContent;
    }
}
