const bot = require('../../telegram_bot');

class InlineButtons {
  constructor(chatId) {
    this.multiSelect = false;
    this.bot = bot;
    this.chatId = chatId;
    this._list = [];
    this.checkedChar = ' ✔';
    this.selectionMap = new Map();
  }

  set list(value) {
    this._list = value.concat([[{ text: 'Далее', callback_data: 'process:next' }]])
  }

  get list() {
    return this._list;
  }

  parseValue(callback_data) {
    return callback_data.split(':')[1];
  }

  uncheckSelection(id) {
    const value = this.selectionMap.get(id);
    value[0].text = value[0].text.replace(this.checkedChar, '');
    this.selectionMap.delete(id);
  }

  messageCallback(ctx) {
    const id = this.parseValue(ctx.data);
    const matched = this.list.find(category => category[0].callback_data === ctx.data);

    if (this.selectionMap.has(id)) {
      this.uncheckSelection(id);
      return this.sendEditedMessage();
    }

    if (!this.multiSelect && this.selectionMap.size > 0)
      this.uncheckSelection(this.selectionMap.keys().next().value);

    matched[0].text += this.checkedChar;
    this.selectionMap.set(id, matched);

    this.sendEditedMessage();
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
    return this.bot.editMessageReplyMarkup(
      { inline_keyboard: this.list }, { message_id: this.messageId, chat_id: this.chatId });
  }

  buildQuery() {
    throw new Error('This method should be implemented');
  }

  process() {
    this.sendMessage();
  }
}

module.exports = InlineButtons;
