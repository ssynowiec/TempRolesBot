import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionFlagsBits } from 'discord-api-types/v10';
import { supabase } from '../db.connnect.js';
import { deleteRolesWhosEnded } from '../functions/deleteRolesWhosEnded.function.js';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';

export const give = {
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
						name: '1 minuta',
						value: '1m',
					},
					{
						name: '2 minut',
						value: '2m',
					},
					{
						name: '5 minut',
						value: '5m',
					},
					{ name: '1 godzina', value: '1h' },
					{ name: '30 dni', value: '30d' },
					{ name: '∞', value: 'perm' },
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
	async execute(interaction, bot) {
		const role = await interaction.options.getRole('rola');
		const time = await interaction.options.getString('time');
		const user = await interaction.options.getMember('user');
		const originalMessage = interaction;

		const nowTimeStamp = Date.now();
		let endTimeStamp = 0;
		let humanTime;

		switch (time) {
			case '1m':
				endTimeStamp = nowTimeStamp + 60000;
				humanTime = '1 minutę';
				break;
			case '2m':
				endTimeStamp = nowTimeStamp + 120000;
				humanTime = '2 minuty';
				break;
			case '5m':
				endTimeStamp = nowTimeStamp + 300000;
				humanTime = '5 minut';
				break;
			case '1h':
				endTimeStamp = nowTimeStamp + 3600000;
				humanTime = '1 godzinę';
				break;
			case '30d':
				endTimeStamp = nowTimeStamp + 2592000000;
				humanTime = '30 dni';
				break;
			case 'perm':
				endTimeStamp = 9999999999;
				humanTime = 'zawsze';
				break;
		}

		const tempRoleData = {
			user: user.id,
			role: role.id,
			endTime: endTimeStamp,
		};

		try {
			const { data: sData, error: sError } = await supabase
				.from('temproles')
				.select()
				.eq('user', tempRoleData.user);

			if (sData.length !== 0) {
				const oldRole = sData[0].role;
				if (sData[0].role === tempRoleData.role) {
					const buttons = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('delete')
								.setLabel('Usuń rangę')
								.setStyle('DANGER'),
						)
						.addComponents(
							new MessageButton()
								.setCustomId('extend')
								.setLabel('Przedłuż rangę')
								.setStyle('SUCCESS'),
						);

					const embed = new MessageEmbed()
						.setColor()
						.setTitle(
							'Ten użytkownik ma już przypisaną taką samą rolę. Co chesz teraz zrobić?',
						)
						.setDescription(
							`\`\"Usuń rangę\"\` - powoduje odebranie roli użytkownikowi oraz usunięcie czasu wygaśnięcia\n\`\"Przedłuż rangę\"\` - powoduje ustawienie rangi od tego momentu na ${humanTime}`,
						)
						.setFooter({
							text: 'Wszystkie operacje są nieodwracalne',
						});

					await interaction.reply({
						content: `Ten użytkownik ma już przypisaną taką samą rolę. Co chesz teraz zrobić?`,
						ephemeral: true,
						embeds: [embed],
						components: [buttons],
					});
				} else {
					const buttons = new MessageActionRow()
						.addComponents(
							new MessageButton()
								.setCustomId('replace')
								.setLabel('Zastąp rangę')
								.setStyle('DANGER'),
						)
						.addComponents(
							new MessageButton()
								.setCustomId('add')
								.setLabel('Dodaj rangę')
								.setStyle('SUCCESS'),
						);

					const embed = new MessageEmbed()
						.setColor()
						.setTitle(
							'Ten użytkownik ma już przypisaną rolę czasową. Co chesz teraz zrobić?',
						)
						.setDescription(
							`\*\*Ten użytkownik ma już przypisaną rolę czasową <@&${sData[0].role}>. Co chesz teraz zrobić?\*\*\n\`\"Zastąp rangę\"\` - powoduje usunięcie poprzedniej rangi oraz dodanie nowej\n\`\"Dodaj rangę\"\` - powoduje pozostawienie poprzedniej rangi oraz dodanie nowej`,
						)
						.setFooter({
							text: 'Wszystkie operacje są nieodwracalne',
						});

					await interaction.reply({
						content: `Ten użytkownik ma już przypisaną rolę czasową <@&${sData[0].role}>. Co chesz teraz zrobić?`,
						ephemeral: true,
						embeds: [embed],
						components: [buttons],
					});
				}

				const timeOutToAction = setTimeout(() => {
					interaction.editReply({
						content: `Upłynął czas na podjęcie ackji, ranga nie została przyznana`,
						ephemeral: true,
						embeds: [],
						components: [],
					});
					return;
				}, 30000);

				bot.on('interactionCreate', interaction => {
					if (!interaction.isButton()) return;

					const deleteRole = async () => {
						const { data, error } = await supabase
							.from('temproles')
							.delete()
							.eq('user', tempRoleData.user)
							.eq('role', tempRoleData.role);

						await user.roles.remove(role);

						await originalMessage.editReply({
							content: `Pomyślnie usunięto rangę`,
							ephemeral: true,
							embeds: [],
							components: [],
						});
					};

					const extendRole = async () => {
						const { data, error } = await supabase
							.from('temproles')
							.update({ endTime: tempRoleData.endTime })
							.eq('user', tempRoleData.user)
							.eq('role', tempRoleData.role);

						await originalMessage.editReply({
							content: `Pomyslnie zmieniono ${role} dla ${user} na ${humanTime}`,
							ephemeral: true,
							embeds: [],
							components: [],
						});
					};

					const replaceRole = async () => {
						const { data, error } = await supabase
							.from('temproles')
							.update({
								role: tempRoleData.role,
								endTime: tempRoleData.endTime,
							})
							.eq('user', tempRoleData.user)
							.eq('role', tempRoleData.role);

						await originalMessage.editReply({
							content: `Pomyslnie zmieniono rangę <@&${oldRole}> na ${role} dla ${user} na ${humanTime}`,
							ephemeral: true,
							embeds: [],
							components: [],
						});
					};

					const addRole = async () => {
						const { data, error } = await supabase
							.from('temproles')
							.insert([tempRoleData]);
						user.roles.add(role);

						await originalMessage.editReply({
							content: `Pomyślnie przyznano rangę ${role} dla ${user} na ${humanTime}`,
							ephemeral: true,
							embeds: [],
							components: [],
						});
					};

					switch (interaction.customId) {
						case 'delete':
							deleteRole();
							break;
						case 'extend':
							extendRole();
							break;
						case 'replace':
							replaceRole();
							break;
						case 'add':
							addRole();
							break;
					}
					clearTimeout(timeOutToAction);
				});
			} else {
				const { data, error } = await supabase
					.from('temproles')
					.insert([tempRoleData]);
				user.roles.add(role);

				await interaction.reply({
					content: `Przyznano rangę ${role} dla ${user} na ${humanTime}`,
					ephemeral: true,
				});
			}
			deleteRolesWhosEnded(interaction.guild);
		} catch (error) {
			console.log(error);
		}
	},
};
