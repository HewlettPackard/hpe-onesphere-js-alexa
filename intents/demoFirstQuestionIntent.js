// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const Analytics = require('../analytics');

const messages = require('../constants/messages');

module.exports = function () {
	// Alexa, what do you think of One Sphere?
	//
	// RE: I must say I\'m enjoying my interactions with One Sphere
	// and recommend every AWS customer sign up.

	console.log('* DemoFirstQuestionIntent');

	const analytics = new Analytics();
	analytics.sendAsset('DemoFirstQuestionIntent');

	this.attributes.speechOutput = this.t('DEMO_QUESTION_1_RESPONSE');
	this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
	this.emit(messages.ResponseReady);
};
