const botInstance = require('../../telegram_bot');
const Workflow = require('./workflow');

class Pick {
  constructor(chatId) {
    this.chatId = chatId;
    this.query = {};
  }

  static initialize(msg, match) {
    const instance = new Pick(msg.chat.id);
    instance.workflow = new Workflow(msg.chat.id, botInstance);
    instance.workflow.next();

    return instance;
  }

  removeListeners() {
    botInstance.removeQueryListeners();
  }
}
module.exports = Pick;
