const bot = require('../../telegram_bot');

class InlineButtons {
  constructor(chatId) {
    this.bot = bot;
    this.chatId = chatId;
    this._list = [];
    this.checkedChar = ' ✔';
    this.query = {};
  }

  set list(value) {
    this._list = value.concat([[{ text: 'Далее', callback_data: 'process:next' }]])
  }

  get list() {
    return this._list;
  }

  sendMessage() {
    if (!this.id)
      throw new Error('callback_query id is missing');


    this.bot.sendMessage(this.chatId, this.title, {
      reply_markup: { inline_keyboard: this._list },
    })
      .then(sentMessage => {
        this.messageId = sentMessage.message_id;
        this.bot.onCallbackQuery(new RegExp(`${this.id}:`, 'i'), this.messageCallback.bind(this));

        return sentMessage;
      });
  }

  formatData(list) {
    return list.map(({ name, value }) => ([{ text: name, callback_data: `${this.id}:${value}` }]));
  }

  sendEditedMessage() {
    return this.bot.editMessageReplyMarkup({ inline_keyboard: this.list }, { message_id: this.messageId, chat_id: this.chatId });
  }

  messageCallback() {
    throw new Error('This method should be implemented');
  }

  buildQuery() {
    throw new Error('This method should be implemented');
  }

  process() {
    this.sendMessage();
  }
}

module.exports = InlineButtons;
