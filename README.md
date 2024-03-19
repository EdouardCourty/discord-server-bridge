# Discord Server Bridge

[![ESLint](https://github.com/EdouardCourty/discord-server-bridge/actions/workflows/ESLint.yml/badge.svg)](https://github.com/EdouardCourty/discord-server-bridge/actions/workflows/ESLint.yml)

This project can be used as a template for future Discord bots.<br />
To start fresh, simply delete the content of the `src/CommandHandler` & `src/EventHandler` folders and implement your own logic.

I'm using PM2 as my deployment tool and ESLint as my linter.<br />
Both config files can be found in the root directory of the project (`ecosystem.config.cjs` & `.eslintrc.json`)

### Features

This bot aims to connect multiple Discord servers together using a dedicated channel in each server.
Whenever a message is sent in one of those server, it will be replicated to the other channels.

The `@everyone` and `@here` mentions are not forwarded in the bridge channels, to avoid spamming.

Message replies are handled, threads are not.<br />

**Settings**<br />
File & Image upload can be regulated using the configuration. By default, a newly linked bridge channel will not receive images or files from the bridge. <br />
User mentions are also blocked by default.<br />
<br />
These settings can be changed using the `configure edit` command which will allow an administrator to allow file & image reception, as well as user mentions.

**Security**<br />
The `link`, `unlink` and `configure edit` command can only be used by server administrators.

### Commands

- `link` - Links the current channel to the multi-server bridge
- `unlink` - Removes the current channel from the multi-server bridge
- `list` - Show a list of all the currently connected servers & channels
- `stats` - Shows the bot's statistics (Uptime, ping, linked servers)
- `configure <edit|show>` - Edits or shows the current bridge channel configuration

### Contributing

Please submit any PR you want to this project. Make sure ESLint is passing.

&copy; Edouard Courty - 2024
