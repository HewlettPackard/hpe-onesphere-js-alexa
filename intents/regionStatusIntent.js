// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const Analytics = require('../analytics');
const messages = require('../constants/messages');

module.exports = function () {
	// Alexa,what are my "HPE Private Cloud" Regions?
	//
	// RE: 2 out of 2 regions status OK.

	console.log('* RegionStatusIntent');

	const analytics = new Analytics();
	analytics.sendAsset('RegionStatusIntent');

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
		oneSphereApi.getRegionsStatus(this.event.session.authData)
			.then((response) => {
				const result = {
					total: 0,
					ok: 0,
					regions: [],
				};

				response.members.forEach((region) => {
					if (
						region
							.provider
							.providerType
							.name.toLowerCase() === intentObj.slots.Provider.value.toLowerCase()) {
						result.total += 1;
						result.regions.push(region.name);
						if (region.status === messages.Ok) {
							result.ok += 1;
						}
					}
				});

				this.attributes.speechOutput = this.t('REGIONS_STATUS', result.total, result.regions.join(' and '), result.ok, result.total);
				this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
				this.emit(messages.ResponseReady);
			})
			.catch((err) => {
				console.log(err);
				this.attributes.speechOutput = this.t(messages.ErrorMessage);
				this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
				this.emit(messages.ResponseReady);
			});
	}
};
