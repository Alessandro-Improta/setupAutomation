const auth = require('./auth.js');
const google = auth.google;
const analytics = google.analytics('v3');
const data = require('./data.js');

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

	// createProperty: function(req, res, next) {
	// 	analytics.management.webproperties.insert({
	// 		accountId: accountId,
	// 		resource: {
	// 			name: data.inputData.theater,
	// 			industryVertical: "PEOPLE_AND_SOCIETY",
	// 			kind: "analytics#webproperty",
	// 			level: "STANDARD",
	// 			id: 'UV-' + accountId + '-1',
	// 			permissions: {
	// 				effective: ["COLLABORATE", "EDIT", "MANAGE_USERS", "READ_AND_ANALYZE"]
	// 			},
	// 			websiteUrl: data.inputData.website
	// 		}
	// 	},
	// 	function(err, response) {
	// 		if (err) {
	// 			console.log('create property error: ', err, accountId);
	// 			res.send({
	// 				message: 'error creating property'
	// 			})
	// 		} else {
	// 			res.send({
	// 				message: 'property created Successfully!'
	// 			})
	// 		}
	// 	})
	// },

	linkAnalytics: function(req, res, next) {
		analytics.management.webPropertyAdWordsLinks.insert({
			accountId: accountId,
			webPropertyId: webPropertyId,
			resource: {
				adWordsAccounts: [{
					kind: "analytics#adWordsAccount",
					customerId: data.inputData.customerId,
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