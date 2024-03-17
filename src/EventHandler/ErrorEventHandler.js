import DiscordEventHandler from "../lib/DiscordEventHandler.js";
import Logger from "../Service/Logger.js";

export default class extends DiscordEventHandler {
    constructor(client) {
        super(client, 'error');
    }

    async handle(error) {
        Logger.error(error);
    }
}
