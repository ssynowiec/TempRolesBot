import util from 'minecraft-server-util';
import { deleteRolesWhosEnded } from '../functions/deleteRolesWhosEnded.function.js';

export const ready = {
	name: 'ready',
	once: true,
	async execute(bot) {
		let type = 'inGame';

		const options = {
			timeout: 1000 * 20, // timeout in milliseconds
			enableSRV: true, // SRV record lookup
		};

		const inGame = () => {
			bot.user.setActivity('HitCraft.pl', {
				type: 'PLAYING',
			});
			type = 'IP';
		};

		const IP = () => {
			bot.user.setActivity('IP: HitCraft.pl', {
				type: 'PLAYING',
			});

			type = 'onlinePlayers';
		};

		const onlinePlayers = () => {
			util.status('145.239.91.45', 46176, options)
				.then(result => {
					bot.user.setActivity(
						`${result.players.online} Graczy online!`,
						{
							type: 'WATCHING',
						},
					);
				})
				.catch(error => console.error(error));
			type = 'join';
		};

		const join = () => {
			util.status('145.239.91.45', 46176, options)
				.then(result => {
					bot.user.setActivity(
						`Dołącz do ${result.players.online} graczy!`,
						{
							type: 'WATCHING',
						},
					);
				})
				.catch(error => console.error(error));
			type = 'inGame';
		};

		inGame();

		setInterval(() => {
			switch (type) {
				case 'inGame':
					inGame();
					break;

				case 'IP':
					IP();
					break;

				case 'onlinePlayers':
					onlinePlayers();
					break;

				case 'join':
					join();
					break;

				default:
					inGame();
					break;
			}
		}, 30000);

		console.log(`I\`m ready`);

		const guild = bot.guilds.cache.get(process.env.GUILDID);

		deleteRolesWhosEnded(guild);
	},
};
