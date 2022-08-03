import { endTime } from '../events/endTime.event.js';
import { interactionCreate } from '../events/interactionCreate.event.js';
import { ready } from '../events/ready.event.js';
import { message } from '../events/message.event.js';

const events = [endTime, interactionCreate, ready, message];

export const eventHandler = bot => {
	for (const event of events) {
		if (event.once) {
			bot.once(event.name, (...args) => event.execute(...args, bot));
		} else {
			bot.on(event.name, (...args) => event.execute(...args, bot));
		}
	}
};
