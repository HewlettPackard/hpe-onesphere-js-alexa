const messages = require('../constants/messages');

module.exports = function () {
	this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
	this.emit(messages.ResponseReady);
};
