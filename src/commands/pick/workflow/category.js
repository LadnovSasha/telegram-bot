const api = require('../../../api');
const Base = require('../../base/command');

class Category extends Base {
  constructor(chatId, categories) {
    super(chatId);

    this.selected = null;
    this.id = 'category_id';
    this.title = 'Category';
    this.list = this.formatData(categories);
  }

  static async initialize(chatId) {
    let categories = await api.getCategories();
    return new Category(chatId, categories);
  }
}

module.exports = Category;
