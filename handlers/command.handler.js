import { Collection } from 'discord.js';

import { give } from '../commands/give.command.js';
import { ping } from '../commands/ping.command.js';
import { refresh } from '../commands/refresh.command.js';
import { remove } from '../commands/remove.command.js';
import { test } from '../commands/test.command.js';

const commandsArr = [give, ping, refresh, remove, test];

export const commandHandler = bot => {
	bot.commands = new Collection();

	for (const command of commandsArr) {
		bot.commands.set(command.data.name, command);
	}
};
