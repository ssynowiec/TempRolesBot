export const message = {
	name: 'messageCreate',
	async execute(message) {
		console.log('test');
		if (message.channel.id === '1004382536555835462') {
			console.log('to ten kanał');
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
