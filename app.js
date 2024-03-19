import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

import EventLoader from "./src/Service/EventLoader.js";
import CommandLoader from "./src/Service/CommandLoader.js";
import Logger from "./src/Service/Logger.js";

dotenv.config();

Logger.info('Starting up');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

await EventLoader.loadEventHandlers(client);
await CommandLoader.loadCommands(client);

client.login(process.env.TOKEN).catch((error) => {
    Logger.error(error);
});
