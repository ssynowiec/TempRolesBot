export const message = {
	name: 'messageCreate',
	async execute(message) {
		if (message.channel.id === '1004382536555835462') {
			try {
				await message.react('🤬');
				await message.react('🚀');
				await message.react('❤');
			} catch (error) {}
		} else {
			return;
		}
	},
};
