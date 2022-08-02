import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { deleteRolesWhosEnded } from '../functions/deleteRolesWhosEnded.function.js';

export const refresh = {
	data: new SlashCommandBuilder()
		.setName('refresh')
		.setDescription('Sprawdź i usuń niekatywne rangi natychmiast')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		await deleteRolesWhosEnded(interaction.guild);

		await interaction.editReply({
			content: 'Pomyślnie sprawdzono i usnięto nieaktualne rangi',
			ephemeral: true,
		});
	},
};
