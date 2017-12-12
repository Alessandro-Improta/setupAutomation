const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const google = require('googleapis');
const auth = require('./auth.js');
const gtm = require('./GTMController.js');
const sheets = require('./sheetsController.js');
const data = require('./data.js');
const analytics = require('./analytics.js');


const app = express();

const corsOptions = {
	origin: 'http://localhost:3000'
}

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cors(corsOptions));


const port = 3000;

app.get('/loggedIn', auth.loggedIn);
app.get('/firstLogIn', auth.firstLogIn);
app.get('/secondLogIn', auth.secondLogIn);
app.get('/template', sheets.getTemplate);
app.get('/getTagManagerAccount', gtm.getTagManagerAccount);
app.get('/getGTMContainer', gtm.getGTMContainer);
app.get('/data', data.getInputData);
app.get('/adwordsAccount', auth.getAdwordsAccount)
app.get('/analyticsAccount', analytics.getAnalyticsAccount);
app.get('/getVariables', gtm.getVariables);
app.get('/webProperties', analytics.getWebProperties);
app.get('/getEmail', gtm.getEmail);

app.put('/tokens', auth.setTokens);
app.put('/findAndReplace', sheets.findAndReplace);
app.put('/addData', data.addData);
app.put('/startOver', auth.startOver);

app.post('/newAccount', sheets.newAccount);
app.post('/createGTMContainer', gtm.createGTMContainer);
app.post('/createGTMVariables', gtm.createGTMVariables);
app.post('/createGTMTag', gtm.createTags);
app.post('/createGTMTrigger', gtm.createGTMTrigger);
app.post('/revokeToken', auth.revokeToken);
app.post('/sendLinkRequest', auth.sendLinkRequest);
app.post('/acceptLinkRequest', auth.acceptLinkRequest);
app.post('/linkAnalytics', analytics.linkAnalytics);
app.post('/sendEmail', gtm.sendEmail);

app.listen( port, function(){
	console.log("listening on port " + port);
});

// api key: AIzaSyAiii8Og5zZlJ7m1rjg1sYbSIYzkU2uvUs
// Scope: https://www.googleapis.com/auth/spreadsheets
// Discovery Sheet: https://sheets.googleapis.com/$discovery/rest?version=v4
// Client ID: 1037770292-oohlht2dnieanagkcmt90o8979grn3h8.apps.googleusercontent.com
// Template spreadsheet ID: 13cDmMd-iS8tofM-EvSSMWD4VsT1zN-r0AZoEupDJ9WE
// Client secret: D1ht5Wso2vydo5XIKD4_fO3G
// Developer Token: NRfUDgxy825XbJ-jmNbLZQ

