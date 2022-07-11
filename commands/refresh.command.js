import { SlashCommandBuilder } from '@discordjs/builders';
import { deleteRolesWhosEnded } from '../functions/deleteRolesWhosEnded.function.js';

export const refresh = {
	data: new SlashCommandBuilder()
		.setName('refresh')
		.setDescription('Check and delete inactive roles'),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		await deleteRolesWhosEnded(interaction.guild);

		await interaction.editReply({
			content: 'Pomyślnie sprawdzono i usnięto nieaktualne rangi',
			ephemeral: true,
		});
	},
};
