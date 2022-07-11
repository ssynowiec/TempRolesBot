import { supabase } from '../db.connnect.js';

export const deleteRolesWhosEnded = async guild => {
	const nowTimeStamp = Date.now();

	const { data, error } = await supabase
		.from('temproles')
		.delete()
		.lt('endTime', nowTimeStamp);

	for (const tempRoleData of data) {
		const role = guild.roles.cache.find(r => r.id === tempRoleData.role);

		const member = await guild.members.fetch(tempRoleData.user);

		try {
			member.roles.remove(role);
		} catch (error) {
			console.log(error);
		}
	}
};
