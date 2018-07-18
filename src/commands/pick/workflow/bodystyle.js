const api = require('../../../api');
const Base = require('../../base/command');

class Bodystyles extends Base {
  constructor(chatId, bodystyles) {
    super(chatId);
    this.id = 'bodystyles';
    this.title = 'BodyStyle';
    this.list = this.formatData(bodystyles);
  }

  static async initialize(chatId, category) {
    const bodystyles = await api.getBodystyles(chatId, category);

    return new Bodystyles(chatId, bodystyles);
  }

  messageCallback(msg) {

  }

  buildQuery() {

  }
}
