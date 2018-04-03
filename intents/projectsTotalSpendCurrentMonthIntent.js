// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const Analytics = require('../analytics');
const messages = require('../constants/messages');
const enums = require('../constants/enums');

const { MonthNames } = enums;

module.exports = function () {
	// what are my project spends?
	//
	// RE: You have 4 projects with a total February spend of $

	console.log('* ProjectsTotalSpendCurrentMonthIntent');

	const analytics = new Analytics();
	analytics.sendAsset('ProjectsTotalSpendCurrentMonthIntent');

	const month = new Date().getMonth();
	const year = new Date().getFullYear();
	const periodCount = -1;
	const periodStart = month + 1;


	const params = {
		metric: 'cost.usage',
		period: 'month',
		periodStart: new Date(Date.UTC(year, periodStart, 1)),
		category: 'projects',
		periodCount,
	};

	const oneSphereApi = new OneSphereApi();
	oneSphereApi.getTotalSpend(this.event.session.authData, params)
		.then((metrics) => {
			let total = 0;

			metrics.members.forEach((member) => {
				if (member && member.values && member.values.length > 0) {
					total += member.values[0].value;
				}
			});

			this.attributes.speechOutput = this.t('PROJECTS_TOTAL_SPEND', MonthNames[month], Math.round(total));
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
