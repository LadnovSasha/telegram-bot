require('dotenv').config();
const botInstance = require('./src/telegram_bot');
const commands = require('./src/commands');

const session = new Map();

botInstance.onText(/\/pick/, function(ctx) {
  const key = `${ctx.from.id}:${ctx.chat.id}`;

  if (session.has(key)) {
    session.get(key).removeListeners();
  }

  const command = commands.Pick.initialize(ctx);
  session.set(key, command);
});
