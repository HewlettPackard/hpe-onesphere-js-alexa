// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const messages = require('./constants/messages');

module.exports = {
	en: {
		translation: {
			SKILL_NAME: 'One Sphere',
			WELCOME_MESSAGE: 'Welcome to HPE %s.',
			WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
			DEFAULT_REPROMPT: 'How can I help you?',
			PROVIDER_RATING: '%s score is %s. ',
			PROVIDER_CONFIRMATION: 'You are asking about the %s provider, is that correct?',
			PROVIDER_QUESTION: 'Okay, What is your provider?',
			PROVIDER_NOT_FOUND: 'The %s provider is not found.',
			PROJECTS_TOTAL_SPEND: 'Your spend across all projects in %s is $%s',
			PROJECTS_TOP_SPEND: 'Your project %s has the highest spend in %s of $%s',
			PROJECT_SHUTDOWN_QUESTION: 'What project would you like to shutdown?',
			PROJECT_SHUTDOWN_CONFIRMATION: 'Okay, the project %s will become inactive if you suspend it. Do you want to proceed?',
			PROJECT_SHUTDOWN_SUCCESS: 'Okay, suspending project...',
			REGIONS_STATUS: '%s regions: %s, %s of %s regions status Ok.',
			REGION_CONFIRMATION: 'You are asking about the %s region, is that correct?',
			REGION_QUESTION: 'Okay, What is your region?',
			REGION_STATUS_SHORT: 'The %s region is %s.',
			REGION_STATUS_FULL_SINGLE: 'The %s region is %s. There is %s zone. %s',
			REGION_STATUS_FULL_PLURAL: 'The %s region is %s. There are %s zones. %s',
			REGION_NOT_FOUND: 'The %s region is not found.',
			PROVIDERS_STATUS: '%s out of %s providers status Ok. ',
			PROVIDERS_STATUS_SINGLE: '%s providers with status %s. ',
			PROVIDERS_TOTAL_SPEND: 'The total spend across all of your providers in %s is $%s',
			LOB_CURRENT_MONTH_SPEND: 'The line of business %s has the highest spend this month, total of $%s',
			UTILIZATION_SCORE: 'The utilization score in %s is %s, using ',
			DEMO_QUESTION_1_RESPONSE: 'I must say, I\'m enjoying my interactions with One Sphere and recommend every AWS customer sign up.',
			HELP_MESSAGE: "You can ask questions such as, What's my provider rating, or, you can say exit...Now, what can I help you with?",
			HELP_REPROMPT: "You can say things like, What's my provider rating, or you can say exit...Now, what can I help you with?",
			ERROR_MESSAGE: 'Ooops! An error occurred, please try again!',
			STOP_MESSAGE: messages.Goodbye,
		},
	},
};
