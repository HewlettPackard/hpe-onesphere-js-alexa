const messages = require('../constants/messages');

module.exports = function () {
	this.response.speak(messages.Goodbye);
	this.emit(messages.ResponseReady);
};
