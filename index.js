const express = require('express');
const bodyParser = require('body-parser');
const google = require('googleapis');
const auth = require('./auth.js');
const gtm = require('./GTMController.js');
const sheets = require('./sheetsController.js');
const analytics = require('./analytics.js');


const app = express();
const port = 3000;
const serveFile = function(req, res, next) {
  res.sendFile("/public/index.html", {root: __dirname })
};

// app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.all('/', serveFile);
app.all('/newOrLink', serveFile);
app.all('/templateQuestion', serveFile);
app.all('/enterTemplate', serveFile);
app.all('/theater', serveFile);
app.all('/cityState', serveFile);
app.all('/customerId', serveFile);
app.all('/website', serveFile);
app.all('/homepage', serveFile);
app.all('/about', serveFile);
app.all('/directions', serveFile);
app.all('/buyTickets', serveFile);
app.all('/externalTicketing', serveFile);
app.all('/address', serveFile);
app.all('/averageTicketPrice', serveFile);
app.all('/accountsLogIn', serveFile);
app.all('/accountsActions', serveFile);
app.all('/clientLogIn', serveFile);
app.all('/clientActions', serveFile);
app.all('/customerIdLink', serveFile);
app.all('/accountsLogInLink', serveFile);
app.all('/accountsActionsLink', serveFile);
app.all('/clientLogInLink', serveFile);
app.all('/clientActionsLink', serveFile);

app.get('/getTagManagerAccount', gtm.getTagManagerAccount);
app.get('/getGTMContainer', gtm.getGTMContainer);
app.get('/adwordsAccount', auth.getAdwordsAccount)
app.get('/analyticsAccount', analytics.getAnalyticsAccount);
app.get('/getVariables', gtm.getVariables);
app.get('/webProperties', analytics.getWebProperties);
app.get('/getEmail', gtm.getEmail);
app.get('/getProfiles', analytics.getProfiles);
app.get('/getGoals', analytics.getGoals);
app.get('/getCsvData', sheets.getCsvData);
app.get('/getPendingRequests', auth.getPendingRequests);

app.put('/logIn', auth.logIn);
app.put('/tokens', auth.setTokens);
app.put('/template', sheets.copyTemplateTo);
app.put('/findAndReplace', sheets.findAndReplace);
app.put('/deleteEmptySheetInNewSpreadsheet', sheets.deleteEmptySheetInNewSpreadsheet);

app.post('/newAccount', sheets.createEmptySpreadsheet);
app.post('/createGTMContainer', gtm.createGTMContainer);
app.post('/createGTMVariables', gtm.createGTMVariables);
app.post('/createGTMTag', gtm.createTags);
app.post('/createGTMTrigger', gtm.createGTMTrigger);
app.post('/revokeToken', auth.revokeToken);
app.post('/sendLinkRequest', auth.sendLinkRequest);
app.post('/acceptLinkRequest', auth.acceptLinkRequest);
app.post('/endLink', auth.endLink);
app.post('/linkAnalytics', analytics.linkAnalytics);
app.post('/sendEmail', gtm.sendEmail);
app.post('/createGoal', analytics.createGoal);

app.listen( port, function(){
	console.log("listening on port " + port);
});