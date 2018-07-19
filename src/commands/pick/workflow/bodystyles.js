const api = require('../../../api');
const Base = require('../../base/command');

class Bodystyles extends Base {
  constructor(chatId, bodystyles) {
    super(chatId);
    this.multiSelect = true;
    this.id = 'bodystyles';
    this.title = 'BodyStyle';
    this.list = this.formatData(bodystyles);
  }

  static async initialize(chatId, category) {
    const bodystyles = await api.getBodystyles(category);

    return new Bodystyles(chatId, bodystyles);
  }

  buildQuery() {
    if (!this.selected)
      return;

    return { category_id: this.selected.callback_data };
  }
}

module.exports = Bodystyles
