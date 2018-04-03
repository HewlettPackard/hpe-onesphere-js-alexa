// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const request = require('superagent');

const ClientId = process.env.ANALYTICS_CLIENT_ID;
const ApiUri = process.env.ANALYTICS_API_URI;

class Analytics {
	// eslint-disable-next-line class-methods-use-this
	sendAsset(assetTitle) {
		const payload = {
			key: 'click',
			value: {
				clientId: ClientId,
				category: 'Alexa OneSphere',
				asset: {
					title: `alexa: ${assetTitle}`,
					link: 'https://alexa.onesphere.analytics-url.com',
				},
			},
		};

		return request
			.post(`${ApiUri}/analytics/analytics`)
			.send(payload)
			.set('Accept', 'application/json')
			.then(() => {
				console.log(`event sent: ${assetTitle}`);
			})
			.catch((err) => {
				console.log(err);
			});
	}
}

module.exports = Analytics;
