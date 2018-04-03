// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const Analytics = require('../analytics');
const messages = require('../constants/messages');

module.exports = function () {
	// How are my One Sphere cloud providers doing
	// Alexa, ask One Sphere how my cloud providers are doing
	//
	// RE: 2 out of 2 providers status is OK

	console.log('* ProviderStatusIntent');

	const analytics = new Analytics();
	analytics.sendAsset('ProviderStatusIntent');

	const oneSphereApi = new OneSphereApi();
	oneSphereApi.getProvidersList(this.event.session.authData)
		.then((providersList) => {
			const providerStatus = {
			};

			providersList.forEach((provider) => {
				if (!providerStatus[provider.typeName.toLowerCase()]) {
					providerStatus[provider.typeName.toLowerCase()] = provider.status.toLowerCase();
				} else if (providerStatus[provider.typeName.toLowerCase()] === messages.Ok) {
					providerStatus[provider.typeName.toLowerCase()] = provider.status.toLowerCase();
				}
			});

			let totalOk = 0;
			let totalProviders = 0;
			Object.keys(providerStatus).forEach((key) => {
				totalProviders += 1;
				if (providerStatus[key] === messages.Ok) {
					totalOk += 1;
				}
			});

			return this.t(messages.ProvidersStatus, totalOk, totalProviders);
		})
		.then(providerStatus => oneSphereApi.getProviderRating(this.event.session.authData)
			.then((rating) => {
				let output = '';
				rating.forEach((r) => {
					output += this.t(messages.ProviderRating, r.typeName, r.score);
				});

				this.attributes.speechOutput = providerStatus + output;
				this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
				this.emit(messages.ResponseReady);
			}))
		.catch((err) => {
			console.log(err);
			this.attributes.speechOutput = this.t(messages.ErrorMessage);
			this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
			this.emit(messages.ResponseReady);
		});
};
