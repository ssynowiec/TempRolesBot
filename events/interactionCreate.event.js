import 'dotenv/config';

export const interactionCreate = {
	name: 'interactionCreate',
	async execute(interaction, bot) {
		if (!interaction.isCommand()) return;

		const command = bot.commands.get(interaction.commandName);

		if (!command) return;

		if (command.ownerOnly && interaction.member.id !== process.env.OWNERID)
			return interaction.reply({
				content:
					'Nie masz wystarczających uprawnień, aby użyć tej komendy',
				ephemeral: true,
			});

		if (
			command.guildOwnerOnly &&
			interaction.member.id !== interaction.guild.ownerId
		)
			return interaction.reply({
				content:
					'Nie masz wystarczających uprawnień, aby użyć tej komendy',
				ephemeral: true,
			});

		try {
			await command.execute(interaction, bot);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	},
};
