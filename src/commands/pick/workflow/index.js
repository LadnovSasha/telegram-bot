const InlineButtonsHandler = require('../../base/inlinebuttons_handler');
const workflowConfig = require('./config');
const flow = ['category', 'bodystyles', 'brands', 'models'];

class Workflow {
  constructor(chatId, bot) {
    this.bot = bot;
    this.chatId = chatId;
    this.flow = flow[Symbol.iterator]();
    this.setupListener();
    this.searchQuery = {};
  }

  setupListener() {
    this.bot.onCallbackQuery(/process:/, this.processStep.bind(this));
  }

  processStep() {
    Object.assign(this.searchQuery, this.current.buildQuery());
    this.next();
  }

  async createStep(type) {
    const config = workflowConfig.get(type);
    let args = [];

    if (!config.api)
      throw new Error('API call should be specified');

    if (config.apiArgs)
      args = config.apiArgs.map(arg => this.searchQuery[arg]);

    const list = await config.api(...args);

    this.current = new InlineButtonsHandler({
      bot: this.bot,
      chatId: this.chatId,
      id: config.id,
      title: config.title,
      multiSelect: config.multiSelect || false,
      list: this.formatData(config.id, list),
    });

    return this.current;
  }

  formatData(id, list) {
    return list.map(({ name, value }) => ([{ text: name, callback_data: `${id}:${value}` }]));
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
