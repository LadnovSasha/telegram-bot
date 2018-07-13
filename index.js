require('dotenv').config();
const bot = require('./src/telegram_bot');
const commands = require('./src/commands');

const instance = bot.getInstance();

instance.on('message', commands.pick);
