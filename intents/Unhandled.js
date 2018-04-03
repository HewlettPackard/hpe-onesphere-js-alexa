// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const messages = require('../constants/messages');

module.exports = function () {
	this.attributes.speechOutput = this.t(messages.HelpMessage);
	this.attributes.repromptSpeech = this.t(messages.HelpRepromt);
	this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
	this.emit(messages.ResponseReady);
};
