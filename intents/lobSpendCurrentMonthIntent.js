// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const Analytics = require('../analytics');
const messages = require('../constants/messages');

module.exports = function () {
	// Alexa, which line of business has the highest spend this month
	//
	// The line of business "name" has the highest spend this month, total of $
	console.log('* LobSpendCurrentMonthIntent');

	const analytics = new Analytics();
	analytics.sendAsset('LobSpendCurrentMonthIntent');

	const month = new Date().getMonth();
	const year = new Date().getFullYear();
	const periodCount = -1;
	const periodStart = month + 1;

	const params = {
		metric: 'cost.usage',
		period: 'month',
		periodStart: new Date(Date.UTC(year, periodStart, 1)),
		category: 'projects',
		groupBy: 'tagKeyUri',
		query: 'tagKeyUri EQ /rest/tag-keys/line-of-business',
		periodCount,
	};

	const oneSphereApi = new OneSphereApi();
	oneSphereApi.getTotalSpend(this.event.session.authData, params)
		.then((metrics) => {
			let maxTotal = 0;
			let maxName = '';

			metrics.members.forEach((member) => {
				if (member &&
					member.values &&
					member.values.length > 0 &&
					member.values[0].value > maxTotal) {
					maxTotal = member.values[0].value;
					maxName = member.resource.name;
				}
			});

			this.attributes.speechOutput = this.t('LOB_CURRENT_MONTH_SPEND', maxName, Math.round(maxTotal));
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
