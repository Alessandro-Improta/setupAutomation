const auth = require('./auth.js');
const google = auth.google;
const tagmanager = google.tagmanager('v2');
const gmail = google.gmail('v1');
const people = google.people('v1');
const btoa = require('btoa');

module.exports = {
	getVariables: function(req, res, next) {
		tagmanager.accounts.containers.workspaces.variables.list({
			parent: 'accounts/1264975472/containers/7205452/workspaces/6'
		},
		function(err, response) {
			if (err) {
				console.log(err);
			} else {
				res.send({
					message: response
				})
			}
		})
	},

	getTagManagerAccount: function(req, res, next) {
		tagmanager.accounts.list(function(err, response){
  					if (err) {
  						res.send({
  							message: 'Error getting Tag Manager account'
  						});
  					} else {
  						GTMAccountId = response.account[0].accountId;
  						res.send({
  							message: 'Tag Manager accounts retrieved!'
  						});
  					}
  				});
	},

	createGTMContainer: function(req, res, next) {
		tagmanager.accounts.containers.create({
			parent: 'accounts/' + GTMAccountId,
			resource: {
				name: req.body.theater,
				timeZoneCountryId: "US",
				timeZoneId: "America/Denver",
				usageContext: ["web"]
			}
		},
		function(err, response) {
			if (err) {
				console.log(err);
				res.send({
					message: 'Creating GTM container failed'
				})
			} else {
				containerId = response.containerId
				res.send({
					message: 'Successfully created GTM container'
				});
			}
		})
	},

	getGTMContainer: function(req, res, next) {
		tagmanager.accounts.containers.get({
			path: 'accounts/' + GTMAccountId + '/containers/' + containerId
		},
		function(err, response) {
			if (err) {
				console.log(err);
				res.send({
					message: 'error getting container'
				})
			} else {
				publicId = response.publicId;
				res.send({
					message: 'Successfully got container!',
				});
			}
		});
	},

	createGTMVariables: function(req, res, next) {
		let send = {}
		tagmanager.accounts.containers.workspaces.variables.create({
			parent: 'accounts/' + GTMAccountId + '/containers/' + containerId + '/workspaces/1',
			resource: {
				name: "ClickURL Full",
				type: "aev",
				parameter: [
					{
						type: "boolean",
						key: "setDefaultValue",
						value: "false"
					},

					{
						type: "template",
						key: "varType",
						value: "URL"
					},

					{
						type: "template",
						key: "component",
						value: "URL"
					}
				]
			}
		},
		function(err, response) {
			if (err) {
				send.message1 = "error creating ClickURL Full Variable";
				console.log("clickURL FULL: ", err);
				if (send.message1 && send.message2 && send.message3 && send.messsage4) {
					res.send(send);
				}
			} else {
				send.message1 = "ClickURL Full Variable created successfully!"
				if (send.message1 && send.message2 && send.message3 && send.messsage4) {
					res.send(send);
				}
			}
		});

		tagmanager.accounts.containers.workspaces.variables.create({
			parent: 'accounts/' + GTMAccountId + '/containers/' + containerId + '/workspaces/1',
			resource: {
				name: "UA-Counter",
				type: "c",
				parameter: [
					{
						type: "template",
						key: "value",
						value: "UA-96460295-17"
					}
				]
			}
		},
		function(err, response) {
			if (err) {
				send.message2 = "error creating UA-Counter Variable";
				console.log("UA-Counter: ", err);
				if (send.message1 && send.message2 && send.message3 && send.messsage4) {
					res.send(send);
				}
			} else {
				send.message2 = "UA-Counter Variable created successfully!"
				if (send.message1 && send.message2 && send.message3 && send.messsage4) {
					res.send(send);
				}
			}
		});

		tagmanager.accounts.containers.workspaces.variables.create({
			parent: 'accounts/' + GTMAccountId + '/containers/' + containerId + '/workspaces/1',
			resource: {
				name: "Auto Link Domains",
				type: "c",
				parameter: [
					{
						type: "template",
						key: "value",
						value: req.body.homePageUrl
					}
				]
			}
		},
		function(err, response) {
			if (err) {
				send.message3 = "error creating Auto Link Domains Variable";
				console.log("Auto Link Domains: ", err);
				if (send.message1 && send.message2 && send.message3 && send.messsage4) {
					res.send(send);
				}
			} else {
				send.message3 = "Auto Link Domains Variable created successfully!"
				if (send.message1 && send.message2 && send.message3 && send.messsage4) {
					res.send(send);
				}
			}
		});

		tagmanager.accounts.containers.workspaces.variables.create({
			parent: 'accounts/' + GTMAccountId + '/containers/' + containerId + '/workspaces/1',
			resource: {
				name: "UA-config",
				type: "gas",
				parameter: [
					{
						type: "template",
						key: "cookieDomain",
						value: "auto"
					},

					{
						type: "boolean",
						key: "doubleClick",
						value: "true"
					},

					{
						type: "boolean",
						key: "setTrackerName",
						value: "false"
					},

					{
						type: "boolean",
						key: "useDebugVersion",
						value: "false"
					},

					{
						type: "list",
						key: "fieldsToSet",
						list: [
							{
								type: "map",
								map: [
									{
										type: "template",
										key: "fieldName",
										value: "cookieDomain"
									},

									{
										type: "template",
										key: "value",
										value: "auto"
									}
								]
							},

							{
								type: "map",
								map: [
									{
										type: "template",
										key: "fieldName",
										value: "allowLinker"
									},

									{
										type: "template",
										key: "value",
										value: "true"
									}
								]
							}
						]
					},

					{
						type: "boolean",
						key: "useHashAutoLink",
						value: "false"
					},

					{
						type: "boolean",
						key: "decorateFormsAutoLink",
						value: "false"
					},

					{
						type: "template",
						key: "autoLinkDomains",
						value: "{{Auto Link Domains}}"
					},

					{
						type: "boolean",
						key: "enableLinkId",
						value: "false"
					},

					{
						type: "boolean",
						key: "enableEcommerce",
						value: "false"
					},

					{
						type: "template",
						key: "trackingId",
						value: "{{UA-Counter}}"
					}
				]
			}
		},
		function(err, response) {
			if (err) {
				send.message4 = "error creating UA-config Variable";
				console.log("UA-config: ", err);
				if (send.message1 && send.message2 && send.message3 && send.messsage4) {
					res.send(send);
				}
			} else {
				send.message4 = "UA-config Variable created successfully!"
				if (send.message1 && send.message2 && send.message3 && send.messsage4) {
					res.send(send);
				}
			}
		});
	},

	createTags: function(req, res, next) {
		let send = {};
		tagmanager.accounts.containers.workspaces.tags.create({
			parent: 'accounts/' + GTMAccountId + '/containers/' + containerId + '/workspaces/1',
			resource: 	{
				name: 'Google Analytics - btn click event',
				type: 'ua',
				parameter: [
						{
							type: 'boolean',
							key: 'nonInteraction',
							value: 'false'
						},

						{
							type: 'boolean',
							key: 'overrideGaSettings',
							value: 'false'
						},

						{
							type: 'template',
							key: 'eventCategory',
							value: 'Button'
						},

						{
							type: 'template',
							key: 'trackType',
							value: 'TRACK_EVENT'
						},

						{
							type: 'template',
							key: 'gaSettings',
							value: "{{UA-config}}"
						},

						{
							type: 'template',
							key: 'eventAction',
							value: 'Click'
						}
					]
				}
			},
			function(err, response) {
				if (err) {
					console.log(err);
					send.message1 = 'error creating Google Analytics - btn click event Tag'
				} else {
					send.message1 = 'Google Analytics - btn click event Tag created successfully!'
					if (send.message1 && send.message2) {
						res.send(send);
					}
				}
		});

		tagmanager.accounts.containers.workspaces.tags.create({
			parent: 'accounts/' + GTMAccountId + '/containers/' + containerId + '/workspaces/1',
			resource: {
				name: 'UA - Main Tag',
				type: 'ua',
				parameter: [
					{
						type: 'boolean',
						key: 'overrideGaSettings',
						value: 'false'
					},

					{
						type: 'template',
						key: 'trackType',
						value: 'TRACK_PAGEVIEW'
					},

					{
						type: 'template',
						key: 'gaSettings',
						value: '{{UA-config}}'
					}
				]
			}
		},
			function(err, response) {
				if (err) {
					console.log(err);
					send.message2 = 'error creating Main Tag'
				} else {
					send.message2 = 'Main Tag created successfully!'
					if (send.message1 && send.message2) {
						res.send(send);
					}
				}
		});


	},

	createGTMTrigger: function(req, res, next) {
		tagmanager.accounts.containers.workspaces.triggers.create({
			parent: 'accounts/' + GTMAccountId + '/containers/' + containerId + '/workspaces/1',
			resource: {
				name: 'ClickUrlFull-Trigger',
				type: 'linkClick',
				autoEventFilter: [
					{
						type: 'matchRegex',
						parameter: [
							{
								type: 'template',
								key: 'arg0',
								value: '{{Page URL}}'
							},

							{
								type: 'template',
								key: 'arg1',
								value: '.*'
							}
						]
					}
				],
				checkValidation: {
					type: 'boolean',
					value: 'true'
				},
				filter: [
					{
						type: 'contains',
						parameter: [
							{
								type: 'template',
								key: 'arg0',
								value: '{{ClickURL Full}}'
							},

							{
								type: 'template',
								key: 'arg1',
								value: req.body.website
							}
						]
					}
				],
				uniqueTriggerId: {
					type: 'template'
				},
				waitForTags: {
					type: 'boolean',
					value: 'true'
				},
				waitForTagsTimeout: {
					type: 'template',
					value: '2000'
				}
			}
		},
		function(err, response) {
			if (err) {
				console.log(err);
				res.send({
					message: 'Error Creating ClickUrlFull-Trigger Trigger'
				})
			} else {
				res.send({
					message: 'ClickUrlFull-Trigger Created Successfully!'
				})
			}
		})
	},

	getEmail: function(req, res, next) {
		people.people.get({
			personFields: "emailAddresses",
			// requestMask: {
			// 	includeField: "person.emailAddresses"
			// },
			resourceName: 'people/me'
		},
		function(err, response) {
			if (err) {
				console.log(err);
				res.send({
					message: 'error retrieving email'
				})
			} else {
				console.log(response);
				emailAddress = response.emailAddresses[0].value;
				res.send({
					message: 'email retrieved'
				})
			}
		})
	},

	sendEmail: function (req, res, next) {
		let encodedEmail = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
		gmail.users.messages.send({
			userId: "me",
			resource: {
				raw: encodedEmail,
				payload: {
					headers: [
						{
							name: "To",
							value: "aimprota30@gmail.com"
						},

						{
							name: "From",
							value: "me"
						},

						{
							name: "Subject",
							value: "GTM Installation Tracking Codes"
						}
					]
				}
			}
		},
		function(err, response) {
			if (err) {
				console.log("Send email: ", err);
				res.send({
					message: 'error sending email'
				})
			} else {
				res.send({
					message: 'Email sent!'
				})
			}
		});
	}
}

let GTMAccountId;
let containerId;
let publicId = "TEST";
let emailAddress;
let email =  "From: " + emailAddress + "\r\n" +
  "To: accounts@fillyourseats.com\r\n" +
  "Subject: GTM Installation Tracking Codes\r\n\r\n" +

  "Paste this code as high in the <head> of the page as possible:                      \
\
<!-- Google Tag Manager -->\
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':\
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],\
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=\
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);\
})(window,document,'script','dataLayer','" + publicId + "');</script>\
<!-- End Google Tag Manager -->                                                                             \
\
\
\
Additionally, paste this code immediately after the opening <body> tag:                                      \
\
<!-- Google Tag Manager (noscript) -->\
<noscript><iframe src=\"https://www.googletagmanager.com/ns.html?id=\"" + publicId + "\"\
height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe></noscript>\
<!-- End Google Tag Manager (noscript) -->";