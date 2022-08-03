export const ready = {
	name: 'message',
	once: false,
	async execute(message) {
		if (message.channel.id === '1004382536555835462') {
			message.react('🤬', '🚀', '❤');
		} else {
			return;
		}
	},
};
