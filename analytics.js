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
					message: 'retrived webp roperties Successfully!'
				})
			}
		})
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