import { deleteRolesWhosEnded } from '../functions/deleteRolesWhosEnded.function.js';
import { changeStatus } from '../functions/changeStatus.function.js';

export const ready = {
	name: 'ready',
	once: true,
	async execute(bot) {
		changeStatus(bot);

		console.log(`I\`m ready`);

		const guild = bot.guilds.cache.get(process.env.GUILDID);
		deleteRolesWhosEnded(guild);
	},
};
