function chooseBodyStyle(msg) {
	return [{ text: 'test', callback_data: 'test_data'}];
}
function stub(msg, match) {
	console.log('recevied')
	const chatId = msg.chat.id;
	const options = {
	    reply_markup: {
	      inline_keyboard: [chooseBodyStyle()],
	      parse_mode: 'Markdown'
    	}
	}

	this.sendMessage(chatId, "I'm alive!", options);
}
module.exports = stub;
