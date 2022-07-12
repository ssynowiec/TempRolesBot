import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { supabase } from '../db.connnect.js';
import { deleteRolesWhosEnded } from '../functions/deleteRolesWhosEnded.function.js';

export const status = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Sprawdź status wygasania rang')
		.addRoleOption(option =>
			option
				.setName('rola')
				.setDescription(
					'Wyświetli wszystkich użytkowników którzy posiadają tę rolę czasową',
				)
				.setRequired(false),
		)
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('Sprawdź kiedy użytkownikowi wygasa rola')
				.setRequired(false),
		),
	async execute(interaction) {
		deleteRolesWhosEnded(interaction.guild);
        const role = await interaction.options.getRole('rola');
		const user = await interaction.options.getMember('user');
        
		const embed = new MessageEmbed()
			.setTitle('Aktywne rangi')
			.setDescription('Opis wszystkich komend');
		await interaction.reply('Pong!');
	},
};
