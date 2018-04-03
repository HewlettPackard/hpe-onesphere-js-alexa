// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const Analytics = require('../analytics');
const messages = require('../constants/messages');

module.exports = function () {
	// Alexa, what is the status of my zones in Houston region?
	// Alexa, ask One Sphere about the status of my zones in Houston region?
	// or Alexa, how is my Houston region doing?
	// or Alexa, how is Houston doing?
	//
	// RE: In Houston region there is 1 zone:
	// Beach-1 zone is OK and; it has 1 cluster named Picaso and 8 datastores and 5 networks.

	console.log('* ZoneStatusByRegionIntent');

	const analytics = new Analytics();
	analytics.sendAsset('ZoneStatusByRegionIntent');

	const intentObj = this.event.request.intent;

	if (intentObj.slots.Region.confirmationStatus !== messages.confirmed) {
		if (intentObj.slots.Region.confirmationStatus !== messages.Denied &&
			intentObj.slots.Region.value) {
			const slotToConfirm = 'Region';
			const speechOutput = this.t('REGION_CONFIRMATION', intentObj.slots.Region.value);
			const repromptSpeech = speechOutput;
			this.emit(':confirmSlot', slotToConfirm, speechOutput, repromptSpeech);
		} else {
			const slotToElicit = 'Region';
			const speechOutput = this.t('REGION_QUESTION');
			const repromptSpeech = speechOutput;
			this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
		}
	} else {
		const oneSphereApi = new OneSphereApi();
		oneSphereApi.getRegionsStatus(this.event.session.authData).then((resp) => {
			const region = resp
				.members.find(r => r.name.toLowerCase() === intentObj.slots.Region.value.toLowerCase());

			if (region) {
				if (region.zones.length > 0) {
					const execute = [];

					return region.zones.forEach((zone) => {
						execute.push(oneSphereApi.getEntityDetails(this.event.session.authData, zone.uri)
							.then((zoneDetails) => {
								let output = `${zone.name}, `;

								if (zoneDetails.clusters.length > 0) {
									output += ` that has ${zoneDetails.clusters.length} `;

									zoneDetails.clusters.forEach((cluster) => {
										output += `cluster named "${cluster.name}"`;
										if (cluster.datastores.length > 0) {
											output += ` with ${cluster.datastores.length} datastores, `;
										}
									});
								}

								return output;
							}).then(clusterInfo => oneSphereApi.getNetworks(this.event.session.authData, `zoneUri EQ ${zone.uri}`).then(zoneNetworks => `${clusterInfo} and ${zoneNetworks.total} networks.`)));

						return Promise.all(execute).then((clusters) => {
							if (region.zones.length === 1) {
								this.response.speak(this.t('REGION_STATUS_FULL_SINGLE', intentObj.slots.Region.value, region.status, region.zones.length, clusters.join(' cluster '))).listen(this.t(messages.DefaultRepromt));
							} else {
								this.response.speak(this.t('REGION_STATUS_FULL_PLURAL', intentObj.slots.Region.value, region.status, region.zones.length, clusters.join(' cluster '))).listen(this.t(messages.DefaultRepromt));
							}
							this.emit(messages.ResponseReady);
						});
					});
				}
				this.response.speak(this.t('REGION_STATUS_SHORT', intentObj.slots.Region.value, region.status)).listen(this.t(messages.DefaultRepromt));
				this.emit(messages.ResponseReady);
			} else {
				this.response.speak(this.t('REGION_NOT_FOUND', intentObj.slots.Region.value)).listen(this.t(messages.DefaultRepromt));
				this.emit(messages.ResponseReady);
			}
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
