// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const messages = require('../constants/messages');

module.exports = function () {
	console.log('* launch request');

	const oneSphereApi = new OneSphereApi();
	oneSphereApi.getUser(this.event.session.authData)
		.then(() => {
			this.attributes.speechOutput = this.t(messages.WelcomeMessage, this.t('SKILL_NAME'));
			this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

			this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
			this.emit(messages.ResponseReady);
		})
		.catch((err) => {
			console.log(err);
			this.attributes.speechOutput = this.t(messages.ErrorMessage);
			this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
			this.emit(messages.ResponseReady);
		});
};
