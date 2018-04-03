// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const Alexa = require('alexa-sdk');
const AWS = require('aws-sdk');

const OneSphere = require('./onesphere-api');
const LanguageStrings = require('./translations');

const Host = process.env.ONESPHERE_HOST;
const AppId = process.env.ONESPHERE_APP_ID;

const LaunchRequest = require('./intents/LaunchRequest');
const ProviderTypesExtendedStatusIntent = require('./intents/providerTypesExtendedStatusIntent');
const RegionStatusIntent = require('./intents/regionStatusIntent');
const TotalSpendAcrossProvidersIntent = require('./intents/totalSpendAcrossProvidersIntent');
const LobSpendCurrentMonthIntent = require('./intents/lobSpendCurrentMonthIntent');
const ProjectsTotalSpendCurrentMonthIntent = require('./intents/projectsTotalSpendCurrentMonthIntent');
const ProjectsTopSpendCurrentMonthIntent = require('./intents/projectsTopSpendCurrentMonthIntent');
const ZoneStatusByRegionIntent = require('./intents/zoneStatusByRegionIntent');
const DemoFirstQuestionIntent = require('./intents/demoFirstQuestionIntent');
const UtilizationAcrossHybridCloudsIntentByProviderType = require('./intents/utilizationAcrossHybridCloudsIntentByProviderType');
const SessionEndedRequest = require('./intents/SessionEndedRequest');
const Unhandled = require('./intents/Unhandled');
const HelpIntent = require('./intents/AMAZON_HelpIntent');
const RepeatIntent = require('./intents/AMAZON_RepeatIntent');
const StopInent = require('./intents/AMAZON_StopIntent');
const CancelIntent = require('./intents/AMAZON_CancelIntent');

let username;
let password;

const Handlers = {
	LaunchRequest,
	ProviderTypesExtendedStatusIntent,
	RegionStatusIntent,
	TotalSpendAcrossProvidersIntent,
	LobSpendCurrentMonthIntent,
	ProjectsTotalSpendCurrentMonthIntent,
	ProjectsTopSpendCurrentMonthIntent,
	ZoneStatusByRegionIntent,
	DemoFirstQuestionIntent,
	UtilizationAcrossHybridCloudsIntentByProviderType,
	'AMAZON.HelpIntent': HelpIntent,
	'AMAZON.RepeatIntent': RepeatIntent,
	'AMAZON.StopIntent': StopInent,
	'AMAZON.CancelIntent': CancelIntent,
	SessionEndedRequest,
	Unhandled,
};

const Decrypt = (encrypted) => {
	const kms = new AWS.KMS();
	// eslint-disable-next-line no-buffer-constructor
	const myblob = new Buffer(encrypted, 'base64');
	return kms.decrypt({ CiphertextBlob: myblob }).promise().then(res => res.Plaintext.toString('ascii'));
};

exports.handler = function (event, context, callback) {
	console.log('* init');
	const alexa = Alexa.handler(event, context, callback);
	alexa.APP_ID = AppId;
	alexa.resources = LanguageStrings;
	alexa.registerHandlers(Handlers);

	if (event.session.new === true || !event.session.authData) {
		Promise.resolve()
			.then(() => {
				if (!username) {
					return Decrypt(process.env.ONESPHERE_USERNAME).then((user) => {
						username = user;
					});
				}

				return null;
			})
			.then(() => {
				if (!password) {
					return Decrypt(process.env.ONESPHERE_PASSWORD).then((pass) => {
						password = pass;
					});
				}

				return null;
			})
			.then(() => {
				const oneSphereApi = new OneSphere();
				return oneSphereApi.session(Host, username, password)
					.then((auth) => {
						console.log('* initialized');
						// eslint-disable-next-line no-param-reassign
						event.session.authData = auth;
						alexa.execute();
					});
			})
			.catch((err) => {
				console.log(err);
				// TODO: handle error
			});
	} else {
		alexa.execute();
	}
};
