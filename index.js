require('dotenv').config();
const Telegram = require('node-telegram-bot-api');

let bot;

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
  bot = new Telegram(process.env.TOKEN, { polling: true });
}

bot.on('message', function(msg) {
  console.log(msg);
  bot.sendMessage(msg.chat.id, "I've received your message");
});
