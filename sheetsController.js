const auth = require('./auth.js');
const google = auth.google;
const sheets = google.sheets('v4');
const drive = google.drive('v3');

let template;
let templates = {};
let newSpreadsheetIds = {};
let newSpreadsheetId;
let csvs = [];
const templateIds = {
	id1: '1kO2kc43hlcxwqU3LDkAutZkddO4FrXpgafFEQJsTjmk',
	id2: '1F4zwvoXEPmZp3nYrelwFa39pd7cb_9ZiXR0grodauA0',
	id3: '1STsOrCzZrkRbLVjAIHP9fFCL541mfO7ns7LUQVEnyic'
}
let templatesArr = [];
for (const prop in templateIds) {
	templatesArr.push(templateIds[prop]);
}

console.log(templatesArr);


module.exports = {
	getTemplate: function(req, res, next) {
		const getTemplate = function(templateId, num) {
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
		  			if (num){
		  				templates[num] = response;	
		  			} else {
		  				template = response;
		  				res.send({
							message: 'Got Template'
						});
		  			}
		  		}
			})
		}
		
		if (req.body.templateId !== undefined) {
			let templateId = req.body.templateId;
			getTemplate(templateId);
		} else {
			for(let i = 0; i < templatesArr.length; i++) {
				let num = i + 1;
				getTemplate(templatesArr[i], num);
			}
			res.send({
				message: templates
			});
		}
	},

	newAccount: function(req, res, next) {
		const uploadTemplateCopy = function(num) {
			let resource;
			let title;
			if (num) {
				title = req.body.title + num;
				templates[num].properties.title = title;
				resource = templates[num];
			} else {
				title = req.body.title;
				template.properties.title = req.body.title;
				resource = template;
			}

			
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
					if (num) {
						newSpreadsheetIds[num] = response.spreadsheetId;	
					} else {
						newSpreadsheetId = response.spreadsheetId;
					}
				}
			})
		};

		if (template) {
			uploadTemplateCopy()
		} else {
			for(const prop in templates) {
				uploadTemplateCopy(prop);
			}
			res.send({
				message: newSpreadsheetIds
			});
		}
	},

	findAndReplace: function(req, res, next) {
		const findAndReplace = function(id) {
			batchUpdateRequest = req.body.requests;
			sheets.spreadsheets.batchUpdate({
			  spreadsheetId: id,
			  resource: batchUpdateRequest
			}, 
			function(err, response) {
				if(err) {
					console.log(err);
					res.send({
						message: 'error with find and replace'
					})
				}
			});
		}

		if (newSpreadsheetId) {
			findAndReplace(newSpreadsheetId);
		} else{
			for(const prop in newSpreadsheetIds) {
				findAndReplace(newSpreadsheetIds[prop]);
			}
			res.send({
				message: 'Find and replace successful!'
			});
		}
	},

	downloadNewAccount: function (req, res, next) {
		if (newSpreadsheetId) {
			drive.files.export({
				fileId: newSpreadsheetId,
				mimeType: 'text/csv'
			},
			function(err, response) {
				if (err) {
					console.log('downloadNewAccount', err);
					res.send({
						message: "error downloading csv",
						data: ''
					})
				} else {
					console.log(response);		
					res.send({
						message: "successfully downloaded csv",
						data: [response]
					})
				}
			})

		} else {

			for(const prop in newSpreadsheetIds) {
				drive.files.export({
					fileId: newSpreadsheetIds[prop],
					mimeType: 'text/csv'
				},
				function(err, response){
					if (err) {
						console.log('downloadNewAccount', err);
					} else {
						csvs.push(response);
					}
				})
			}
			res.send({
				message: 'successfully downloaded all csvs',
				data: csvs
			})
		}	
	}
}