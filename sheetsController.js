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

module.exports = {
	getTemplate: function(req, res, next) {
		const getTemplate = function(templateId, num) {
			sheets.spreadsheets.get({
	  			spreadsheetId: templateId,
	  			ranges: [],
	  			includeGridData: true
			}, function (err, response) {
		  		if(err) {
		  			console.log('getTemplate ', err);
		  			res.send({
		  				message: 'error getting message'
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
		};
		
		if (req.body.templateId !== undefined) {
			let templateId = req.body.templateId;
			getTemplate(templateId);
		} else {
			let getMultipleTemplates = function() {
				let counter = 0;
				for(let i = 0; i < templatesArr.length; i++) {
					let num = i + 1;
					getTemplate(templatesArr[i], num);
					counter += 1
				}
				if (counter === templatesArr.length) {
					return templates;
				}
			};

			getMultipleTemplates()
				.then(function(response){
					res.send({
						message: templates
					});
				})
		}
		
	},

	newAccount: function(req, res, next) {
		
		let resource;
		let title;

		const uploadTemplateCopy = function(num) {
			if (num) {
				title = req.body.title + num;
				templates[num].properties.title = title;
				resource = templates[num];
			} else {
				title = req.body.title;
				template.properties.title = title;
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
						console.log(newSpreadsheetIds);	
					} else {
						newSpreadsheetId = response.spreadsheetId;
						res.send({
							message: 'upload succesful!'
						})
					}
				}
			})
		};

		if (template) {
			uploadTemplateCopy(template)
		} else {
			let mulitpleUploads = function() {
				let counter = 0;
				for(const prop in templates) {
					uploadTemplateCopy(prop);
					counter += 1;
				}
				if (counter === Object.keys(templates).length) {
					return newSpreadsheetIds;
				}
			};

			mulitpleUploads()
				.then(function(response){
					res.send({
						message: 'All uploads succesful!'
					});
				})
		}
	},

	findAndReplace: function(req, res, next) {
		const findAndReplace = function(id) {
			console.log(newSpreadsheetIds);
			let batchUpdateRequest = req.body.requests;
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
				} else {
					console.log('succesful find and replace');
				}
			});
		}

		if (newSpreadsheetId) {
			findAndReplace(newSpreadsheetId);
		} else {
			let multipleFindAndReplace = function() {
				let counter = 0;
				for(const prop in newSpreadsheetIds) {
					findAndReplace(newSpreadsheetIds[prop]);
					counter += 1;
				}
				if (counter === Object.keys(newSpreadsheetIds).length) {
					return newSpreadsheetIds;
				}
			};

			multipleFindAndReplace()
				.then(function(response) {
					res.send({
						message: 'all find and replace done!'
					})
				})
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

			let getMultipleCsv = function() {
				let counter = 0;
				for(const prop in newSpreadsheetIds) {
					counter += 0;
					drive.files.export({
						fileId: newSpreadsheetIds[prop],
						mimeType: 'text/csv'
					},
					function(err, response){
						if (err) {
							console.log('downloadNewAccount', err);
							res.send({
								message: 'failed to download one of the CSVs'
							})
						} else {
							csvs.push(response);
						}
					})
				}
				if (counter === newSpreadsheetIds.length) {
					return csvs;
				}
			};

			getMultipleCsv()
				.then(function(response){
					res.send({
						message: 'successfully downloaded all csvs',
						data: csvs
					})
				})
		}	
	}
}