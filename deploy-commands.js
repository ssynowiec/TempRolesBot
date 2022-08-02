import 'dotenv/config';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const CLIENTID = process.env.CLIENTID;
const GUILDID = process.env.GUILDID;
const TOKEN = process.env.TOKEN;

import { give } from './commands/give.command.js';
import { ping } from './commands/ping.command.js';
import { refresh } from './commands/refresh.command.js';
import { remove } from './commands/remove.command.js';
import { test } from './commands/test.command.js';
import { help } from './commands/help.command.js';
import { status } from './commands/status.command.js';

const commands = [
	give.data.toJSON(),
	// ping.data.toJSON(),
	refresh.data.toJSON(),
	// remove.data.toJSON(),
	// help.data.toJSON(),
	status.data.toJSON(),
	// test.data.toJSON(),
];

const rest = new REST({ version: '9' }).setToken(TOKEN);

// rest.put(Routes.applicationGuildCommands(CLIENTID, GUILDID), {
rest.put(Routes.applicationCommands(CLIENTID), {
	body: commands,
})
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
