const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();

const TOKEN = process.env.TOKEN;

const bot = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
	],
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter(file => file.endsWith('.event.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args, bot));
	} else {
		bot.on(event.name, (...args) => event.execute(...args, bot));
	}
}

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter(file => file.endsWith('.command.js'));

bot.commands = new Collection();

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	bot.commands.set(command.data.name, command);
}

bot.login(TOKEN);
