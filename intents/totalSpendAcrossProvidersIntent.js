// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const Analytics = require('../analytics');
const messages = require('../constants/messages');
const enums = require('../constants/enums');

const { MonthNames } = enums;

module.exports = function () {
	// Alexa, what is my total spend for the month?
	// Alexa, what is my total spend for the December?
	//
	// The total spend across all of your providers in February is $8,397

	console.log('* TotalSpendAcrossProvidersIntent');

	const analytics = new Analytics();
	analytics.sendAsset('TotalSpendAcrossProvidersIntent');

	let month = new Date().getMonth();
	let year = new Date().getFullYear();
	let total = 0;
	let periodCount = -1;
	let periodStart = month + 1;

	const intentObj = this.event.request.intent;
	if (intentObj.slots.Month.value) {
		const monthIndex = MonthNames.indexOf(intentObj.slots.Month.value);
		if (monthIndex >= 0) {
			if (monthIndex > month) {
				year -= 1;
			}

			month = monthIndex;
			periodStart = monthIndex;
			periodCount = 1;
		}
	}

	const params = {
		metric: 'cost.total',
		period: 'month',
		periodStart: new Date(Date.UTC(year, periodStart, 1)),
		category: 'providers',
		groupBy: 'providerTypeUri',
		periodCount,
	};

	const oneSphereApi = new OneSphereApi();
	oneSphereApi.getTotalSpend(this.event.session.authData, params)
		.then((metrics) => {
			metrics.members.forEach((member) => {
				if (member && member.values && member.values.length > 0) {
					total += member.values[0].value;
				}
			});

			this.attributes.speechOutput = this.t('PROVIDERS_TOTAL_SPEND', MonthNames[month], Math.round(total));
			this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
			this.emit(messages.ResponseReady);
		})
		.catch((err) => {
			console.log(err);
			this.attributes.speechOutput = this.t(messages.ErrorMessage);
			this.response.speak(this.attributes.speechOutput).listen(this.t(messages.DefaultRepromt));
			this.emit(messages.ResponseReady);
		});
};
