import { SlashCommandBuilder } from '@discordjs/builders';
import { supabase } from '../db.connnect.js';

export const test = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('delete test'),
	// .setDefaultMemberPermissions('823963428867145788'),
	async execute(interaction) {
		const nowTimeStamp = Date.now();

		const { data, error } = await supabase
			.from('temproles')
			.delete()
			.lt('endTime', nowTimeStamp);

		for (const tempRoleData of data) {
			const guild = interaction.guild;
			const role = guild.roles.cache.find(
				r => r.id === tempRoleData.role,
			);

			const member = await guild.members.fetch(tempRoleData.user);

			try {
				member.roles.remove(role);
			} catch (error) {
				console.log(error);
			}
		}

		interaction.deferReply();
		interaction.deleteReply();
	},
};
