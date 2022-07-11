import cron from 'cron';
import { supabase } from '../db.connnect.js';
import 'dotenv/config';

export const endTime = {
	name: 'ready',
	once: true,
	async execute(bot) {
		const deleteRolesWhosEnded = async () => {
			const nowTimeStamp = Date.now();

			const { data, error } = await supabase
				.from('temproles')
				.delete()
				.lt('endTime', nowTimeStamp);

			if (data !== []) {
				for (const tempRoleData of data) {
					const guild = bot.guilds.cache.get(process.env.GUILDID);
					const role = guild.roles.cache.find(
						r => r.id === tempRoleData.role,
					);
					const member = guild.members
						.fetch(tempRoleData.user)
						.then(member => {
							try {
								member.roles.remove(role);
							} catch (error) {
								console.log(error);
							}
						});
				}
			}
		};

		const autoDeleteRoleEvery30Minutes = new cron.CronJob(
			'*/30 * * * *',
			deleteRolesWhosEnded,
		);

		autoDeleteRoleEvery30Minutes.start();
	},
};
