import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { supabase } from '../db.connnect.js';
import { deleteRolesWhosEnded } from '../functions/deleteRolesWhosEnded.function.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export const give = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Nadaj rolę czasową użytkownikowi')
		.addRoleOption(option =>
			option
				.setName('rola')
				.setDescription('Wybierz role którą chcesz nadać')
				.setRequired(true),
		)
		.addIntegerOption(option =>
			option
				.setName('time')
				.setDescription('Podaj czas (w dniach)')
				.setRequired(true),
		)
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('Wybierz użytkownika któremu chcesz nadać rolę')
				.setRequired(true),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction, bot) {
		const role = await interaction.options.getRole('rola');
		const days = await interaction.options.getInteger('time');
		const user = await interaction.options.getMember('user');
		const originalMessage = interaction;

		const dayInMs = 86400000;
		const nowTimeStamp = Date.now();
		const timeToLeft = days * dayInMs;
		let endTimeStamp = nowTimeStamp + timeToLeft;

		const tempRoleData = {
			user: user.id,
			role: role.id,
			endTime: endTimeStamp,
		};

		try {
			const { data: sData, error: sError } = await supabase
				.from('temproles')
				.select()
				// .eq('user', tempRoleData.user);
				.match({ user: tempRoleData.user, role: tempRoleData.role });

			if (sData.length !== 0) {
				interaction.reply(
					`Użytkownik ma już przypisaną taką samą rolę`,
				);
			} else {
				const { data, error } = await supabase
					.from('temproles')
					.insert([tempRoleData]);

				user.roles.add(role);

				await interaction.reply({
					content: `Przyznano rangę ${role} dla ${user} na ${days} dni`,
					ephemeral: true,
				});
			}

			return deleteRolesWhosEnded(interaction.guild);
		} catch (error) {
			console.log(error);
		}
	},
};
