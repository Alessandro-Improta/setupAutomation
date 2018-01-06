const auth = require('./auth.js');
const google = auth.google;
const sheets = google.sheets('v4');

module.exports = {
	getTemplate: function(req, res, next) {
		if (req.body.templateId !== "undefined") {
			let templateId = req.body.templateId;
		} else {
			let templateId = '13cDmMd-iS8tofM-EvSSMWD4VsT1zN-r0AZoEupDJ9WE';
		}
		sheets.spreadsheets.get({
  			spreadsheetId: templateId,
  			ranges: [],
  			includeGridData: true
		}, function (err, response) {
  			if(err) {
  				res.send({
  					message: err
  				})
  			} else {
  				template = response;
  				res.send({
					message: 'Got Template'
				});
  			}
		})
	},

	newAccount: function(req, res, next) {
		template.properties.title = req.body.title;
		sheets.spreadsheets.create({
			resource: template
		}, function(err, response){
			if (err) {
				console.error(err);
				return;
			}
			newSpreadsheetId = response.spreadsheetId;
			res.send({
				message: 'successful Post!'
			});
		})
	},

	findAndReplace: function(req, res, next) {
		batchUpdateRequest = req.body.requests;
		sheets.spreadsheets.batchUpdate({
		  spreadsheetId: newSpreadsheetId,
		  resource: batchUpdateRequest
		}, function(err, response) {
			if(err) {
				console.log(err);
			} else {
				res.send({
					message: 'Find and replace successful!'
				});
		  	}
		  });
	}
}

var template;
var newSpreadsheetId;