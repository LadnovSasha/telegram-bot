const Telegram = require('node-telegram-bot-api');

let bot;

module.exports = {
	getInstance() {
		if (bot)
			return bot;

		if (process.env.WEBHOOK_URL) {
		  bot = new Telegram(process.env.TOKEN, {
		    webHook: {
		      port: 443,
		      key: process.env.KEY,
		      cert: process.env.CERT,
		    },
		  });

		  bot.setWebHook(process.env.WEBHOOK_URL, {
		    certificate: process.env.CERT,
		  });
		} else {
			console.log('polling')
		  bot = new Telegram(process.env.TOKEN, { polling: true });
		}

		return bot;
	}
};
