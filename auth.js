const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const AdwordsUser = require('node-adwords').AdwordsUser;
const AdwordsConstants = require('node-adwords').AdwordsConstants;
const axios = require('axios');
const data = require('./data.js');


 
let adwordsUser = new AdwordsUser({
    developerToken: 'NRfUDgxy825XbJ-jmNbLZQ', //your adwords developerToken
    userAgent: 'Fill Your Seats', //any company name
    // clientCustomerId: the Adwords Account id (e.g. 123-123-123)
    client_id: '1037770292-oohlht2dnieanagkcmt90o8979grn3h8.apps.googleusercontent.com', //this is the api console client_id
    client_secret: 'D1ht5Wso2vydo5XIKD4_fO3G',
    // refresh_token: 'INSERT_OAUTH2_REFRESH_TOKEN_HERE'
});

let oauth2Client = new OAuth2(
  '1037770292-oohlht2dnieanagkcmt90o8979grn3h8.apps.googleusercontent.com',
  'D1ht5Wso2vydo5XIKD4_fO3G',
  'http://localhost:3000'
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
  'https://www.googleapis.com/auth/tagmanager.edit.containers', 
  'https://www.googleapis.com/auth/analytics',
  'https://www.googleapis.com/auth/analytics.manage.users',
  'https://www.googleapis.com/auth/analytics.provision',
  'https://www.googleapis.com/auth/spreadsheets', 
  'https://www.googleapis.com/auth/adwords',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/user.emails.read',
  'https://www.googleapis.com/auth/contacts',
  'https://www.googleapis.com/auth/plus.login'
];

var url = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',

  // If you only need one scope you can pass it as a string
  scope: scopes

  // Optional property that passes state parameters to redirect URI
  // state: 'foo'
});

var refreshToken;
let accessToken;
let loggedIn;
let loggedInAgain;

//create selector

module.exports = {
	google: google,
	adwordsUser: adwordsUser,
	refreshToken: refreshToken,
	loggedIn: function(req, res, next) {
		res.send({
			loggedIn: loggedIn,
			loggedInAgain: loggedInAgain
		});
	},

	firstLogIn: function(req, res, next) {
		loggedIn = true;
		res.send({
			url: url
		});
	},

	startOver: function(req, res, next){
		loggedIn = false;
		loggedInAgain = false;
	},

	secondLogIn: function(req, res, next) {
		loggedInAgain = true;
		oauth2Client = new OAuth2(
		  '1037770292-oohlht2dnieanagkcmt90o8979grn3h8.apps.googleusercontent.com',
		  'D1ht5Wso2vydo5XIKD4_fO3G',
		  'http://localhost:3000'
		);
		url = oauth2Client.generateAuthUrl({
		  access_type: 'offline',
		  scope: scopes,
		});
		res.send({
			url: url
		})
	},

	setTokens: function(req, res, next) {
		var code = req.body.code;
		oauth2Client.getToken(code, function (err, tokens) {
 	 		if (err) {
 	 			console.log(err);
 	 		} else {
 	 			if (tokens.refresh_token) {
 	 				refreshToken = tokens.refresh_token;
 	 			}
 	 			accessToken = tokens.access_token;
    			oauth2Client.setCredentials(tokens);
    			google.options({
  					auth: oauth2Client
				});
				if (data.inputData.customerId) {
					adwordsUser.credentials.clientCustomerId = data.inputData.customerId;
				} else {
					adwordsUser.credentials.clientCustomerId = '790-868-5882'
				}
				console.log(adwordsUser.credentials.clientCustomerId);
    			adwordsUser.credentials.refresh_token = oauth2Client.credentials.refresh_token;
    			adwordsUser.credentials.access_token  = oauth2Client.credentials.access_token;
    			res.send({
  					message: "successfully got and set tokens!" 
  				}); 			
  			}
		});	
	},

	revokeToken: function(req, res, next) {
		axios({
			method: 'post',
			url: 'https://accounts.google.com/o/oauth2/revoke', 
			params: {'token': accessToken},
			headers: {'content-type': 'application/x-www-form-urlencoded'}
			})
		  .then(function (response) {
		    res.send({
		    	message: 'Token revoked!'
		    })
		  })
		  .catch(function (error) {
		    console.log(error);
		  });
	},

	getAdwordsAccount: function(req, res, next) {
		console.log('got to the function');
		let customerService = adwordsUser.getService('CustomerService', 'v201710');
		customerService.getCustomers(function(err, response) {
			console.log('callback ran');
			if (err) {
				console.log(err);
				res.send({
					message: 'error running getAdwordsAccount'
				})
			} else {
				console.log(response);
				res.send({
					message: 'getAdwordsAccount ran successfully'
				})
			}
		});
	},

	sendLinkRequest: function(req, res, next) {
		let managedCustomerService = adwordsUser.getService('ManagedCustomerService');
		let linkOperation = [{
			operator: "ADD",
			operand: {
				managerCustomerId: '7908685882',
				clientCustomerId: data.inputData.customerId,
				linkStatus: 'PENDING',
				pendingDescriptiveName: 'Sent from FYS MCC',
				isHidden: 'false'
			}
		}];
		managedCustomerService.mutateLink({operations: linkOperation}, function(err, response) {
			if (err) {
				// console.log(err);
				res.send({
					message: 'error sending link request'
				})
			} else {
				// console.log(response);
				res.send({
					message: 'Link request sent!'
				})
			}
		})
	},

	acceptLinkRequest: function(req, res, next) {
		let managedCustomerService = adwordsUser.getService('ManagedCustomerService');
		let linkOperation = [{
			operator: "SET",
			operand: {
				managerCustomerId: '7908685882',
				clientCustomerId: data.inputData.customerId,
				linkStatus: 'ACTIVE',
				pendingDescriptiveName: 'Sent from FYS MCC',
				isHidden: 'false'
			}
		}];
		managedCustomerService.mutateLink({operations: linkOperation}, function(err, response) {
			if (err) {
				// console.log(err);
				res.send({
					message: 'error accepting link request'
				})
			} else {
				// console.log(response);
				res.send({
					message: 'Link request accepted!'
				})
			}
		})
	}
}
