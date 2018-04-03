// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const OneSphereApi = require('../onesphere-api');
const Analytics = require('../analytics');
const messages = require('../constants/messages');
const enums = require('../constants/enums');

const { MonthNames } = enums;

module.exports = function () {
	// which project has the highest spend this month?
	//
	// RE: Your project “name” has the highest spend in Januray of $

	console.log('* ProjectsTopSpendCurrentMonthIntent');

	const analytics = new Analytics();
	analytics.sendAsset('ProjectsTopSpendCurrentMonthIntent');

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
		.then(metrics => oneSphereApi.getProjectsList(this.event.session.authData)
			.then((projects) => {
				let topProjectName = '';
				let topProjectSpend = 0;
				projects.forEach((project) => {
					metrics.members.forEach((member) => {
						if (member &&
							member.resourceUri === project.uri &&
							member.values &&
							member.values.length > 0 &&
							member.values[0].value > topProjectSpend) {
							if (!(process.env.IGNORE_SERVICE_SPEND === 'true' && project.name === 'service')) {
								topProjectName = project.name;
								topProjectSpend = member.values[0].value;
							}
						}
					});
				});

				this.attributes.speechOutput = this.t('PROJECTS_TOP_SPEND', topProjectName, MonthNames[month], Math.round(topProjectSpend));
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
