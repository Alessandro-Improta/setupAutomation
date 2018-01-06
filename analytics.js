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
				console.log(accountId);
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
					data: err
				})
			} else {
				console.log('get Profiles', response);
				res.send({
					message: 'Successfully got profiles!',
					data: response
				})
			}
		})
	},

	createGoal: function(req, res, next) {
		analytics.management.goals.insert()
	},

	linkAnalytics: function(req, res, next) {
		analytics.management.webPropertyAdWordsLinks.insert({
			accountId: accountId,
			webPropertyId: webPropertyId,
			resource: {
				adWordsAccounts: [{
					kind: "analytics#adWordsAccount",
					customerId: req.body.customerId,
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