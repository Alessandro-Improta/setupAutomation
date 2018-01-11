const auth = require('./auth.js');
const google = auth.google;
const sheets = google.sheets('v4');
const drive = google.drive('v3');

let newSpreadsheetId;
let csv;

module.exports = {
	createEmptySpreadsheet: function(req, res, next) {
		let title = req.body.title;
		let resource = {
			properties: {title: title}
		};
			
		sheets.spreadsheets.create({
			resource: resource
		}, 
		function(err, response){
			if (err) {
				console.error(title, err);
				res.send({
					message: 'Error creating ' + title
				})
			} else {
				newSpreadsheetId = response.spreadsheetId;
				res.send({
					message: title + ' created succesfully!'
				})
			}
		})
	},

	copyTemplateTo: function(req, res, next) {
		sheets.spreadsheets.sheets.copyTo({
			sheetId: 0,
	  		spreadsheetId: req.body.templateId,
	  		resource: {
	  			destinationSpreadsheetId: newSpreadsheetId
	  		}
		}, 
		function (err, response) {
	  		if(err) {
	  			console.log('copyTo ', err);
		  		res.send({
		  			message: 'error copying template ' + req.body.templateId
		  		})
		  	} else {
		  		res.send({
					message: 'Template copied'
				});
			}
		})
	},

	deleteEmptySheetInNewSpreadsheet: function(req, res, next) {
		sheets.spreadsheets.batchUpdate({
			spreadsheetId: newSpreadsheetId,
			resource: {
				requests: [
					{
						deleteSheet: {
							sheetId: 0
						}
					}
				]
			}
		},
		function(err, response) {
			if (err) {
				console.log('deleteEmptySheetInNewSpreadsheet ', err);
				res.send({
					message: 'Could not delete empty sheet in ' + newSpreadsheetId
				})
			} else {
				res.send({
					message: 'successfully deleted empty sheet in ' + newSpreadsheetId
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
				console.log('getCsvData', err);
				res.send({
					message: "error downloading csv",
					data: false
				})
			} else {		
				res.send({
					message: "successfully downloaded csv",
					data: response
				})
			}
		})
	}	
}