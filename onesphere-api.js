// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

const request = require('superagent');

class OneSphereApi {
	// eslint-disable-next-line class-methods-use-this
	session(host, username, password) {
		const payload = {
			password,
			userName: username,
		};

		return request
			.post(`${host}/rest/session`)
			.send(payload)
			.then(res => ({
				token: res.body.token,
				userUri: res.body.userUri,
				host,
			}))
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	// eslint-disable-next-line class-methods-use-this
	getUser(authData) {
		return request
			.get(authData.host + authData.userUri)
			.set('Authorization', `Bearer ${authData.token}`)
			.then(user => ({
				username: user.body.name,
			}))
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	// eslint-disable-next-line class-methods-use-this
	getProvidersList(authData) {
		return request
			.get(`${authData.host}/rest/provider-types`)
			.set('Authorization', `Bearer ${authData.token}`)
			.then(providerTypes => request
				.get(`${authData.host}/rest/providers`)
				.set('Authorization', `Bearer ${authData.token}`)
				.then((providers) => {
					const result = [];
					providers.body.members.forEach((provider) => {
						const providerType = providerTypes.body.members
							.find(type => type.uri === provider.providerTypeUri);
						result.push({
							name: provider.name,
							typeName: providerType.name,
							typeUri: providerType.uri,
							uri: provider.uri,
							status: provider.status,
							state: provider.state,
						});
					});

					return result;
				}))
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	// eslint-disable-next-line class-methods-use-this
	projectShutdown(authData, projectId) {
		const payload = {
			type: 'suspend',
		};

		return request
			.post(`${authData.host}/rest/deployments/${projectId}/actions`)
			.set('Authorization', `Bearer ${authData.token}`)
			.send(payload)
			.then(() => {
				console.log('project suspended');
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	// eslint-disable-next-line class-methods-use-this
	getProjectsList(authData) {
		return request
			.get(`${authData.host}/rest/projects`)
			.set('Authorization', `Bearer ${authData.token}`)
			.then((projects) => {
				const result = [];
				projects.body.members.forEach((project) => {
					result.push({
						name: project.name,
						description: project.description,
						uri: project.uri,
					});
				});

				return result;
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	getProviderRating(authData) {
		function pad(number) {
			if (number < 10) {
				return `0${number}`;
			}
			return number;
		}

		const now = new Date();
		const today = `${now.getUTCFullYear()
		}-${pad(now.getUTCMonth() + 1)
		}-${pad(now.getUTCDate())
		}T00:00:00Z`;

		return request
			.get(`${authData.host}/rest/metrics`)
			.query({ category: 'providers' })
			.query({ name: 'score.overall' })
			.query({ period: 'day' })
			.query({ periodCount: '1' })
			.query({ periodStart: today })
			.set('Authorization', `Bearer ${authData.token}`)
			.then(metrics => this.getProvidersList(authData)
				.then((providers) => {
					const result = [];
					providers.forEach((provider) => {
						const metric = metrics.body.members.find(m => m.resourceUri === provider.uri);
						if (metric && metric.values && metric.values.length > 0) {
							result.push({
								name: provider.name,
								typeName: provider.typeName,
								score: metric.values[0].value,
								uri: provider.uri,
							});
						}
					});

					return result;
				}))
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	// eslint-disable-next-line class-methods-use-this
	getRegionsStatus(authData) {
		return request
			.get(`${authData.host}/rest/regions`)
			.query({ view: 'full' })
			.set('Authorization', `Bearer ${authData.token}`)
			.then(response => response.body)
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	// eslint-disable-next-line class-methods-use-this
	getEntityDetails(authData, entityUri) {
		return request
			.get(authData.host + entityUri)
			.query({ view: 'full' })
			.set('Authorization', `Bearer ${authData.token}`)
			.then(response => response.body)
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	// eslint-disable-next-line class-methods-use-this
	getNetworks(authData, query) {
		return request
			.get(`${authData.host}/rest/networks`)
			.query({ query })
			.set('Authorization', `Bearer ${authData.token}`)
			.then(response => response.body)
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	// eslint-disable-next-line class-methods-use-this
	getTotalSpend(authData, params) {
		return new Promise((resolve, reject) => {
			request
				.get(`${authData.host}/rest/metrics`)
				.query({ category: params.category })
				.query({ name: params.metric })
				.query({ period: params.period })
				.query({ groupBy: params.groupBy })
				.query({ query: params.query })
				.query({ periodStart: `${params.periodStart.toISOString().split('.')[0]}Z` })
				.query({ view: 'full' })
				.query({ periodCount: params.periodCount })
				.set('Authorization', `Bearer ${authData.token}`)
				.end((err, res) => {
					if (err) {
						console.log(err);
						reject(err);
						return;
					}

					resolve(res.body);
				});
		});
	}

	// eslint-disable-next-line class-methods-use-this
	getMetricValue(authData, resourceUri, metricName, period, periodCount) {
		return request
			.get(`${authData.host}/rest/metrics`)
			.query({ resourceUri })
			.query({ name: metricName })
			.query({ period })
			.query({ periodCount })
			.set('Authorization', `Bearer ${authData.token}`)
			.then((response) => {
				const metricMember = response.body.members.find(m => m.name === metricName);
				if (metricMember && metricMember.values && metricMember.values.length > 0) {
					return metricMember.values[0].value;
				}
				throw new Error('There is no value');
			});
	}


	getUtilization(authData, resourceUri) {
		const result = {
			score: 0,
			cpu: {
				total: 0,
				usage: 0,
			},
			memory: {
				total: 0,
				usage: 0,
			},
			storage: {
				total: 0,
				available: 0,
			},
		};

		return Promise.resolve()
			.then(() => this.getMetricValue(authData, resourceUri, 'score.utilization', 'day', -1)
				.then((score) => {
					result.score = score;
				}))
			.then(() => this.getMetricValue(authData, resourceUri, 'resource.cpu.total', 'day', -1)
				.then((cpuTotal) => {
					result.cpu.total = cpuTotal;
				}))
			.then(() => this.getMetricValue(authData, resourceUri, 'resource.cpu.usage', 'day', -1)
				.then((cpuUsage) => {
					result.cpu.usage = cpuUsage;
				}))
			.then(() => this.getMetricValue(authData, resourceUri, 'resource.memory.total', 'day', -1)
				.then((memoryTotal) => {
					result.memory.total = memoryTotal;
				}))
			.then(() => this.getMetricValue(authData, resourceUri, 'resource.memory.usage', 'day', -1)
				.then((memoryUsage) => {
					result.memory.usage = memoryUsage;
				}))
			.then(() => this.getMetricValue(authData, resourceUri, 'resource.storage.total', 'day', -1)
				.then((storageTotal) => {
					result.storage.total = storageTotal;
				}))
			.then(() => this.getMetricValue(authData, resourceUri, 'resource.storage.available', 'day', -1)
				.then((storageAvailable) => {
					result.storage.available = storageAvailable;
				}))
			.catch((err) => {
				console.log(err);
			})
			.then(() => result);
	}
}

module.exports = OneSphereApi;
