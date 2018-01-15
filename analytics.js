const auth = require('./auth.js');
const google = auth.google;
const analytics = google.analytics('v3');

module.exports = {
	getAnalyticsAccount: function(req, res, next) {
		analytics.management.accounts.list(function(err, response) {
			if (err) {
				console.log(err);
			} else {
				accountId = response.items[0].id;
				res.send({
					message: 'Successfully Got analytics account!'
				})
			}
		})
	},

	getWebProperties: function(req, res, next) {
		analytics.management.webproperties.list({
			accountId: accountId
		},
		function(err, response) {
			if (err) {
				console.log("getWebProperties: ", err);
				res.send({
					message: 'error retrieving web properties'
				})
			} else {
				webPropertyId = response.items[0].id;
				res.send({
					message: 'retrived web properties Successfully!'
				})
			}
		})
	},

	getProfiles: function(req, res, next) {
		analytics.management.profiles.list({
			accountId: accountId,
			webPropertyId: '~all'
		},
		function(err, response) {
			if (err) {
				console.log('get Profiles', err);
				res.send({
					message: 'Error getting profiles',
				})
			} else {
				profileId = response.items[0].id;
				res.send({
					message: 'Successfully got profiles!',
				})
			}
		})
	},

	getGoals: function(req, res, next) {
		analytics.management.goals.list({
			accountId: accountId,
			profileId: '~all',
			webPropertyId: '~all'
		},
		function(err, response) {
			if (err) {
				console.log('GET GOALS', err);
				res.send({
					message: 'Error getting goals',
					data: err
				})
			} else {
				res.send({
					message: 'Successfully got Goals!',
					data: response
				})
			}
		});
	},

	createGoal: function(req, res, next) {
		analytics.management.goals.insert({
			accountId: accountId,
			profileId: profileId,
			webPropertyId: webPropertyId,
			resource: {
				id: '1',
				active: 'true',
				name: 'Buy Btn Click',
				type: 'EVENT',
				eventDetails: {
					eventConditions: [
						{
							expression: 'BuyButton',
							matchType: 'EXACT',
							type: 'CATEGORY'
						},

						{
							expression: 'Click',
							matchType: 'EXACT',
							type: 'ACTION'
						}
					],
					useEventValue: 'true'
				}
			}
		},
		function(err, response) {
			if (err) {
				console.log('CREATE GOAL', err);
				res.send({
					message: 'Error creating goal',
				})
			} else {
				res.send({
					message: 'Successfully created goal!',
				})
			}
		})
	},

	linkAnalytics: function(req, res, next) {
		let customerId = req.body.customerId;
		let customerIdArr = customerId.split("");
		let newCustomerId = customerIdArr[0] + customerIdArr[1] + customerIdArr[2] + '-' + customerIdArr[3] + customerIdArr[4] + customerIdArr[5] + '-' + customerIdArr[6] + customerIdArr[7] + customerIdArr[8] + customerIdArr[9];
		analytics.management.webPropertyAdWordsLinks.insert({
			accountId: accountId,
			webPropertyId: webPropertyId,
			resource: {
				name: "Adwords Link",
				adWordsAccounts: [{
					kind: "analytics#adWordsAccount",
					customerId: newCustomerId,
					autoTaggingEnabled: "true"
				}]
			}
		},
		function(err, response) {
			if (err) {
				console.log('linkAnalytics: ', err);
				res.send({
					message: 'error linking analytics'
				})
			} else {
				res.send({
					message: 'analytics are linked!'
				})
			}
		})
	}	
}

let accountId;
let webPropertyId;
let profileId;