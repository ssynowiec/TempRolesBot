import { Collection } from 'discord.js';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

export const commandHandler = async bot => {
	const commandsPath = './commands';
	const commandFiles = (await readdir(commandsPath)).filter(file =>
		file.endsWith('command.js'),
	);

	bot.commands = new Collection();

	console.log(commandFiles);

	for (const file of commandFiles) {
		const filePath = path.join('../', commandsPath, file);
		const command = await import(filePath);
		bot.commands.set(command.data.name, command);
	}
};
