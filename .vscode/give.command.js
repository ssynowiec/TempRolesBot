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
				.eq('user', tempRoleData.user);

			if (sData.length !== 0) {
				const roleData = sData[0];
				if (roleData.role === tempRoleData.role) {
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
							`\`\"Usuń rangę\"\` - powoduje odebranie roli użytkownikowi oraz usunięcie czasu wygaśnięcia\n\`\"Przedłuż rangę\"\` - powoduje przedłużenie rangi o podany czas`,
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
							`\*\*Ten użytkownik ma już przypisaną rolę czasową. Co chesz teraz zrobić?\*\*\n\`\"Zastąp rangę\"\` - powoduje usunięcie poprzedniej rangi oraz dodanie nowej\n\`\"Dodaj rangę\"\` - powoduje pozostawienie poprzedniej rangi oraz dodanie nowej`,
						)
						.setFooter({
							text: 'Wszystkie operacje są nieodwracalne',
						});

					await interaction.reply({
						content: `Ten użytkownik ma już przypisaną rolę czasową. Co chesz teraz zrobić?`,
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
						console.log(tempRoleData, Date.now());
						const { data, error } = await supabase
							.from('temproles')
							.delete()
							.match({
								user: tempRoleData.user,
								role: tempRoleData.role,
							});

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
							content: `Pomyslnie zmieniono ${role} dla ${user} na ${days} dni`,
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

						await interaction.reply({
							content: `Pomyslnie zmieniono rangę na ${role} dla ${user} na ${days} dni`,
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
							content: `Pomyślnie przyznano rangę ${role} dla ${user} na ${days} dni`,
							ephemeral: true,
							embeds: [],
							components: [],
						});

						await interaction.deferUpdate();
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
