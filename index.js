import { Client, Intents } from 'discord.js';
import 'dotenv/config';

import { commandHandler } from './handlers/command.handler.js';
import { eventHandler } from './handlers/event.handler.js';

const TOKEN = process.env.TOKEN;

const bot = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
	],
});

eventHandler(bot);
commandHandler(bot);

bot.login(TOKEN);
