import DiscordEventHandler from "../lib/DiscordEventHandler.js";
import {Message} from "discord.js";
import ChannelStore from "../Service/ChannelStore.js";

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

        this.#handleBroadcast(message);
    }

    /**
     * @param {Message} message
     */
    #handleBroadcast(message) {
        const channelId = message.channel.id;
        const channels = ChannelStore.getChannels();

        if (ChannelStore.getChannelMap().has(channelId)) {
            channels.forEach((channel) => {
                if (channel.id !== channelId) {
                    channel.send({
                        'content': '**<@' + message.author.id + '> [' + message.guild.name + ']** : ' + this.#prepareMessageContent(message.content)
                    }).catch();
                }
            });
        }
    }

    #prepareMessageContent(content) {
        return content.replace('@everyone', 'everyone').replace('@here', 'here');
    }
}
