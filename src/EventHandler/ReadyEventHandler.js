import DiscordEventHandler from "../lib/DiscordEventHandler.js";
import CommandLoader from "../Service/CommandLoader.js";
import ChannelStore from "../Service/ChannelStore.js";
import Logger from "../Service/Logger.js";

export default class extends DiscordEventHandler {
    constructor(client) {
        super(client, 'ready');
    }

    async handle() {
        Logger.info('Ready! - Logged in as ' + this.getClient().user.displayName);

        await CommandLoader.deployCommands(this.getClient());
        await ChannelStore.init(this.getClient());
    }
}
