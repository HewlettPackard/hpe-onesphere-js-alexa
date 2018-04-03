// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const Analytics = require('../analytics');
const messages = require('../constants/messages');

module.exports = function () {
	// What is my OneSphere utilization across my hybrid clouds?
	//
	// RE: The utilization score in Amazon Web Services is 159, using 5% cpu.
	// The utilization score in your Private Cloud is 625, using 55% cpu, 45% memory, and 55% storage.

	console.log('* UtilizationAcrossHybridCloudsIntent');

	const analytics = new Analytics();
	analytics.sendAsset('UtilizationAcrossHybridCloudsIntent');

	const intentObj = this.event.request.intent;

	if (intentObj.slots.Provider.confirmationStatus !== messages.confirmed) {
		if (intentObj.slots.Provider.confirmationStatus !== messages.Denied &&
			intentObj.slots.Provider.value) {
			const slotToConfirm = 'Provider';
			const speechOutput = this.t(messages.ProviderConfirmation, intentObj.slots.Provider.value);
			this.emit(':confirmSlot', slotToConfirm, speechOutput, speechOutput);
		} else {
			const slotToElicit = 'Provider';
			const speechOutput = this.t(messages.ProviderQuestion);
			this.emit(':elicitSlot', slotToElicit, speechOutput, speechOutput);
		}
	} else {
		const oneSphereApi = new OneSphereApi();
		oneSphereApi.getProvidersList(this.event.session.authData).then((providerTypes) => {
			const execute = [];

			const types = {};

			providerTypes.forEach((providerType) => {
				if (!types[providerType.typeName] &&
					intentObj.slots.Provider.value.toLowerCase() === providerType.typeName.toLowerCase()) {
					types[providerType.typeName] = true;
					execute.push(oneSphereApi
						.getUtilization(this.event.session.authData, providerType.typeUri)
						.then(utilization => ({
							name: providerType.typeName,
							utilization,
						})));
				}
			});

			if (execute.length > 0) {
				return Promise.all(execute).then((providers) => {
					let speech = '';
					providers.forEach((provider) => {
						speech += this.t(messages.UtilizationScore, provider.name, provider.utilization.score);
						speech += `${Math.floor((provider.utilization.cpu.usage / provider.utilization.cpu.total) * 100)}% CPU`;

						if (provider.utilization.memory.total > 0) {
							speech += `, ${Math.floor((provider.utilization.memory.usage / provider.utilization.memory.total) * 100)}% memory`;
						}

						if (provider.utilization.storage.total > 0) {
							speech += `, ${Math.floor(((provider.utilization.storage.total - provider.utilization.storage.available) / provider.utilization.storage.total) * 100)}% storage`;
						}

						speech += '. ';
					});

					this.attributes.speechOutput = speech;
					this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
					this.emit(messages.ResponseReady);
				});
			}
			this.attributes.speechOutput =
				this.t(messages.ProviderNotFound, intentObj.slots.Provider.value);
			this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
			this.emit(messages.ResponseReady);
			return null;
		})
			.catch((err) => {
				console.log(err);
				this.attributes.speechOutput = this.t(messages.ErrorMessage);
				this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
				this.emit(messages.ResponseReady);
			});
	}
};
