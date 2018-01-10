const auth = require('./auth.js');
const google = auth.google;
const sheets = google.sheets('v4');
const drive = google.drive('v3');

let template;
let newSpreadsheetId;
let csv;

module.exports = {
	getTemplate: function(req, res, next) {
		console.log('got template was called');
		sheets.spreadsheets.get({
	  		spreadsheetId: req.body.templateId,
	 		ranges: [],
	  		includeGridData: true
		}, 
		function (err, response) {
	  		if(err) {
	  			console.log('getTemplate ', err);
		  		res.send({
		  			message: 'error getting template ' + req.body.templateId
		  		})
		  	} else {
		  		template = response;
		  		console.log('template: ', template);
		  		res.send({
					message: 'Got Template'
				});
			}
		})
	},

	newAccount: function(req, res, next) {
		console.log('upload copy was called');
		console.log(template);
		let title = req.body.title;
		template.properties.title = title;
		let resource = template;
			
		sheets.spreadsheets.create({
			resource: resource
		}, 
		function(err, response){
			if (err) {
				console.error(title, err);
				res.send({
					message: 'Error uploading template copy ' + title
				})
			} else {
				newSpreadsheetId = response.spreadsheetId;
				res.send({
					message: 'upload of ' + title + ' succesful!'
				})
			}
		})
	},

	findAndReplace: function(req, res, next) {
		console.log('find and replace was called');
		let batchUpdateRequest = req.body.requests;
		sheets.spreadsheets.batchUpdate({
			spreadsheetId: newSpreadsheetId,
			resource: batchUpdateRequest
		}, 
		function(err, response) {
			if(err) {
				console.log('find and replace: ', err);
				res.send({
					message: 'error with find and replace for ' + newSpreadsheetId
				})
			} else {
				res.send({
					message: 'succesful find and replace for ' + newSpreadsheetId + '!'
				})		
			}
		});
	},

	getCsvData: function (req, res, next) {
		console.log('get csv data was called');
		drive.files.export({
			fileId: newSpreadsheetId,
			mimeType: 'text/csv'
		},
		function(err, response) {
			if (err) {
				console.log('downloadNewAccount', err);
				res.send({
					message: "error downloading csv",
					data: false
				})
			} else {
				console.log(response);		
				res.send({
					message: "successfully downloaded csv",
					data: response
				})
			}
		})
	}	
}