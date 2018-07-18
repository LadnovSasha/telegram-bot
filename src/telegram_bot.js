const Bot = require('node-telegram-bot-api');

class Telegram extends Bot {
  constructor(...args) {
    super(...args);

    this.queryRegexpCallbacks = [];
  }

  static getInstance() {
    if (Telegram.instance)
      return Telegram.instance;

    if (process.env.WEBHOOK_URL) {
      Telegram.instance = new this(process.env.TOKEN, {
        webHook: {
          port: 443,
          key: process.env.KEY,
          cert: process.env.CERT,
        },
      });

      Telegram.instance.setWebHook(process.env.WEBHOOK_URL, {
        certificate: process.env.CERT,
      });
    } else {
      console.log('polling')
      Telegram.instance = new this(process.env.TOKEN, { polling: true });
    }

    return Telegram.instance;
  }

  processCallbackQuery(query) {
    const listener = this.queryRegexpCallbacks.find(reg => reg.regexp.exec(query.data));

    if (listener && listener.callback)
      listener.callback(query);
  }

  onCallbackQuery(regexp, callback) {
    if (this.listeners('callback_query').length == 0)
      this.on('callback_query', this.processCallbackQuery);

    this.queryRegexpCallbacks.push({ regexp, callback });
  }

  removeQueryListeners() {
    this.queryRegexpCallbacks = [];
  }
}
module.exports = Telegram.getInstance();
