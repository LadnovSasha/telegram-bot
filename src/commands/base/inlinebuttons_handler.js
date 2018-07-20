const PAGE_LIMIT = 90;
class InlineButtonsHandler {
  constructor(options = {}) {

    Object.assign(this, {
      multiSelect: false,
      checkedChar: ' ✔',
      selectionMap: new Map(),
    }, options);

    this.pages = Math.ceil(this.list.length / PAGE_LIMIT);
    this.bot.onCallbackQuery(new RegExp(`${this.id}:`, 'i'), this.messageCallback.bind(this));
  }

  set list(value) {
    this._list = value.concat([[{ text: 'Далее', callback_data: 'process:next' }]])
  }

  get list() {
    return this._list;
  }

  createPaginationList() {
    const paginationList = [];
    let listIdx = 0;
    let page = 0;
    let limit = PAGE_LIMIT - 1;

    while (page < this.pages) {
      const slice = this.list.slice(listIdx, limit);
      listIdx = limit;
      limit = listIdx + PAGE_LIMIT - 1;

      if (limit > this.list.length)
        limit = this.list.length - 1;

      if (page !== this.pages - 1) {
        slice.push([{ text: 'Следующая страница', callback_data: `${this.id}:next_page` }]);
        slice.push([{ text: 'Далее', callback_data: 'process:next' }]);
      }

      paginationList.push(slice);
      page++;
    }

    return paginationList;
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

    if (id == 'next_page') {
      this.currPage++;
      this.sendEditedMessage();
      return;
    }

    const list = this.pages > 1 ? this.paginationList[this.currPage] : this.list;
    const matched = list.find(category => category[0].callback_data === ctx.data);

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
    const list = this.pages > 1 ? this.paginationList[this.currPage] : this.list;

    if (!this.id)
      throw new Error('callback_query id is missing');


    this.bot.sendMessage(this.chatId, this.title, {
      reply_markup: { inline_keyboard: list },
    }).then(sentMessage => {
      this.messageId = sentMessage.message_id
    });
  }

  sendEditedMessage() {
    const list = this.pages > 1 ? this.paginationList[this.currPage] : this.list;

    return this.bot.editMessageReplyMarkup(
      { inline_keyboard: list }, { message_id: this.messageId, chat_id: this.chatId });
  }

  buildQuery() {
    if (!this.multiSelect)
      return { [this.id]: this.selectionMap.keys().next().value }

    const query = {};
    query[this.id] = [...this.selectionMap.keys()];

    return query;
  }

  paginate() {
    this.paginationList = this.createPaginationList();
    this.currPage = 0;
    this.sendMessage();
  }

  process() {
    return this.pages > 1 ? this.paginate() : this.sendMessage();
  }
}

module.exports = InlineButtonsHandler;
