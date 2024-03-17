# Discord Server Bridge

[![ESLint](https://github.com/EdouardCourty/discord-server-bridge/actions/workflows/ESLint.yml/badge.svg)](https://github.com/EdouardCourty/discord-server-bridge/actions/workflows/ESLint.yml)

This bot aims to connect multiple Discord servers together using a dedicated channel in each server.
Whenever a message is sent in one of those server, it will be replicated to the other channels.

To add a channel to the bridge, run the `/link` command in the text channel.

### Commands

- `link` - Links the current channel to the multi-server bridge
- `unlink` - Removes the current channel from the multi-server bridge
- `list` - Show a list of all the currently connected servers & channels

&copy; Edouard Courty - 2024
