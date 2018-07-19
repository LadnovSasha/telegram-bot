const Category = require('./category');
const Bodystyles = require('./bodystyles');
const flow = ['category', 'bodystyles'];

class Workflow {
  constructor(chatId, bot) {
    this.bot = bot;
    this.chatId = chatId;
    this.flow = this.initializeFlow();
    this.setupListener();
    this.searchQuery = {};
  }

  * initializeFlow() {
    for (let step of flow)
      yield step;
  }

  setupListener() {
    this.bot.onCallbackQuery(/process:/, this.processStep.bind(this));
  }

  processStep() {
    Object.assign(this.searchQuery, this.current.buildQuery());
    this.next();
  }

  async createStep(type) {
    switch(type) {
      case 'category':
        this.current = await Category.initialize(this.chatId);
        break;
      case 'bodystyles':
        this.current = await Bodystyles.initialize(this.chatId, this.searchQuery.category_id);
        break;
    }

    return this.current;
  }

  next() {
    const { value, done } = this.flow.next();

    return done ? this.startSearch() : this.createStep(value).then(step => step.process());
  }

  startSearch() {
    console.log('Stub function');
  }
}

module.exports = Workflow;
