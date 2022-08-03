import { Client, Intents } from 'discord.js';
import 'dotenv/config';
import { eventHandler } from './handlers/event.handler.js';
import { commandHandler } from './handlers/command.handler.js';

const TOKEN = process.env.TOKEN;

const bot = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_MESSAGES,
	],
});

eventHandler(bot);
commandHandler(bot);

bot.login(TOKEN);
