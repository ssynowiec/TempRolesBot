require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

module.exports = {
	supabase: createClient(
		'https://rqipqszpkvxzuhtfzphx.supabase.co',
		process.env.DB_API_KEY,
	),
};
