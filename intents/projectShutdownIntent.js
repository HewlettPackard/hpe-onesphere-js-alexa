// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const Analytics = require('../analytics');
const messages = require('../constants/messages');

module.exports = function () {
	// Alexa, shutdown my project named "Executive Dashboard"
	//
	// RE OK, the project will become inactive if you suspend it.
	// Do you want to proceed?
	//
	// Yes!
	//
	// RE: OK, suspending project…

	console.log('* ProjectShutdownIntent');

	const analytics = new Analytics();
	analytics.sendAsset('ProjectShutdownIntent');

	const intentObj = this.event.request.intent;

	if (intentObj.slots.ProjectName.confirmationStatus !== messages.confirmed) {
		if (intentObj.slots.ProjectName.confirmationStatus !== messages.Denied) {
			const slotToConfirm = 'ProjectName';
			const speechOutput = this.t('PROJECT_SHUTDOWN_CONFIRMATION', intentObj.slots.ProjectName.value);
			const repromptSpeech = speechOutput;
			this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
		} else {
			const slotToElicit = 'ProjectName';
			const speechOutput = this.t('PROJECT_SHUTDOWN_QUESTION');
			const repromptSpeech = speechOutput;
			this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
		}
	} else {
		const oneSphereApi = new OneSphereApi();
		oneSphereApi.projectShutdown(this.event.session.authData, 'c81931d3-546c-4b19-bc28-d8303204073d')
			.then(() => {
				console.log('project suspended');
			})
			.catch((err) => {
				console.log(err);
			})
			.then(() => {
				this.attributes.speechOutput = this.t('PROJECT_SHUTDOWN_SUCCESS');
				this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
				this.emit(messages.ResponseReady);
			});
	}
};
