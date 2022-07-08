require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

module.exports = {
	supabase: createClient(process.env.DB_URL, process.env.DB_API_KEY),
};
