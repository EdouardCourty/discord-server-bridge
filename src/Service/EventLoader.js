import fs from "fs";

import DiscordEventHandler from "../lib/DiscordEventHandler.js";

export default class {
    static async loadEventHandlers(client) {
        const eventFiles = fs.readdirSync('./src/EventHandler').filter((file) => {
            return file.endsWith('.js');
        });

        for (const eventFile of eventFiles) {
            const eventModule = (await import('../EventHandler/' + eventFile)).default;
            /** @type DiscordEventHandler */
            const eventHandler = new eventModule(client);
            client.on(eventHandler.getEventName(), eventHandler.handle.bind(eventHandler));
        }
    }
}
