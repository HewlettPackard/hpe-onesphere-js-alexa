// (C) Copyright 2018 Hewlett Packard Enterprise Development LP

module.exports = function () {
	console.log(`Session ended: ${this.event.request.reason}`);
};
