const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord-api-types/v10');
const { supabase } = require('../db.connnect');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('Give temp role for user!')
		.addRoleOption(option =>
			option
				.setName('rola')
				.setDescription('choose role to give a user')
				.setRequired(true),
		)
		.addStringOption(option =>
			option
				.setName('time')
				.setDescription(
					'choose the time for which the role is to be assigned',
				)
				.setRequired(true)
				.addChoices(
					{
						name: '2 minut',
						value: '2m',
					},
					{ name: '1 godzina', value: '1h' },
				),
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
		const time = await interaction.options.getString('time');
		const user = await interaction.options.getMember('user');

		const nowTimeStamp = Date.now();
		let endTimeStamp = 0;

		switch (time) {
			case '2m':
				endTimeStamp = nowTimeStamp + 120000;
				break;
			case '1h':
				endTimeStamp = nowTimeStamp + 3600000;
				break;
		}

		const tempRoleData = {
			user: user.id,
			role: role.id,
			endTime: endTimeStamp,
		};

		try {
			const { data, error } = await supabase
				.from('temproles')
				.insert([tempRoleData]);
		} catch (error) {
			console.log(error);
		}

		try {
			user.roles.add(role);
		} catch (error) {
			console.log(error);
		}

		await interaction.reply({
			content: `Przyznano ${role} dla ${user} na ${time}`,
			ephemeral: true,
		});
	},
};
