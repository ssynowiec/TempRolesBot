module.exports = {
	name: 'interactionCreate',
	once: true,
	async execute(interaction, bot) {
		if (!interaction.isCommand()) return;

		const command = bot.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	},
};
