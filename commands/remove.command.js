import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { supabase } from '../db.connnect.js';

export const remove = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('Remove role for user!')
		.addRoleOption(option =>
			option
				.setName('rola')
				.setDescription('choose role to give a user')
				.setRequired(true),
		)
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription(
					'select the user to whom you want to assign a role',
				)
				.setRequired(true),
		)
		.setDefaultMemberPermissions(
			PermissionFlagsBits.ManageRoles &&
				PermissionFlagsBits.ModerateMembers,
		),
	async execute(interaction) {
		const role = await interaction.options.getRole('rola');
		const user = await interaction.options.getMember('user');

		try {
			const { data, error } = await supabase
				.from('temproles')
				.delete()
				.match({ user: user.id, role: role.id });
			user.roles.remove(role);
		} catch (error) {
			console.log(error);
		}

		await interaction.reply({
			content: `Odebrano ${role} użytkownikowi ${user}`,
			ephemeral: true,
		});
	},
};
