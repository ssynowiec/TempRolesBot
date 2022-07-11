import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';

export const help = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Command help'),
	async execute(interaction) {
		const embed = new MessageEmbed()
			.setTitle('Command help')
			.setDescription('Opis wszystkich komend');
		await interaction.reply('Pong!');
	},
};
