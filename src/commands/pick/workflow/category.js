const api = require('../../../api');
const Base = require('../../base/command');

class Category extends Base {
  constructor(chatId, categories) {
    super(chatId);

    this.selected = null;
    this.id = 'category';
    this.title = 'Category';
    this.list = this.formatData(categories);
  }

  static async initialize(chatId) {
    let categories = await api.getCategories();
    return new Category(chatId, categories);
  }

  messageCallback(msg) {
    const categoryId = msg.data.split(':')[1];
    const matchedCategory = this.list.find(category => category[0].callback_data === msg.data);

    if (this.selected) {
      this.selected.text = this.selected.text.replace(this.checkedChar, '');

      if (this.selected.callback_data === matchedCategory[0].callback_data) {
        delete this.seleted;
        this.sendEditedMessage();
        return;
      }
    }

    this.selected = matchedCategory[0];
    matchedCategory[0].text += this.checkedChar;
    this.sendEditedMessage();
  }

  buildQuery() {
    if (!this.selected)
      return;

    return { category_id: this.selected.callback_data };
  }
}

module.exports = Category;
