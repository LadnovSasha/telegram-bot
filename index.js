require('dotenv').config();
const Telegram = require('node-telegram-bot-api');

const bot = new Telegram(process.env.TOKEN, {polling: true});

bot.on('message', function(msg) {
	bot.sendMessage(msg.chat.id, "I've received your message");
});
