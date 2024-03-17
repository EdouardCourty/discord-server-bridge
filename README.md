# Discord Server Bridge

[![ESLint](https://github.com/EdouardCourty/discord-server-bridge/actions/workflows/ESLint.yml/badge.svg)](https://github.com/EdouardCourty/discord-server-bridge/actions/workflows/ESLint.yml)

This project can be used as a template for future Discord bots.<br />
To start fresh, simply delete the content of the `src/CommandHandler` & `src/EventHandler` folders and implement your own logic.

### Features

This bot aims to connect multiple Discord servers together using a dedicated channel in each server.
Whenever a message is sent in one of those server, it will be replicated to the other channels.

The `@everyone` and `@here` mentions are not forwarded in the bridge channels, to avoid spamming.

### Commands

- `link` - Links the current channel to the multi-server bridge
- `unlink` - Removes the current channel from the multi-server bridge
- `list` - Show a list of all the currently connected servers & channels

&copy; Edouard Courty - 2024
