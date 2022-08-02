import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { MessageEmbed } from 'discord.js';
import { supabase } from '../db.connnect.js';
import { deleteRolesWhosEnded } from '../functions/deleteRolesWhosEnded.function.js';

export const status = {
	data: new SlashCommandBuilder()
		.setName('status')
		.setDescription('Sprawdź daty wygasnaia roli')
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
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
		deleteRolesWhosEnded(interaction.guild);
		const role = await interaction.options.getRole('rola');
		const user = await interaction.options.getMember('user');

		const query = role ? { role: role.id } : { user: user.id };

		const { data, error } = await supabase
			.from('temproles')
			.select()
			.match(query);

		let usersData;
		if (data.length === 0) {
			usersData = role
				? `Żaden użytkownik nie ma przypisanej tej roli czasowej`
				: `Ten użytkownik nie ma przypisanej żadnej roli czasowej`;
		} else {
			usersData = data
				.map(data => {
					const endTime = new Date(parseInt(data.endTime));
					return `<@${data.user}> posiada <@&${data.role}> do \`${endTime}\``;
				})
				.join('\n');
		}

		const embed = new MessageEmbed()
			.setTitle('Aktywne rangi')
			.setDescription(`${usersData}`);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
