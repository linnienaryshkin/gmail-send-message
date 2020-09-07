const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

const CREDENTIALS_PATH = 'credentials.json';

// Load client secrets from a local file.
fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) {
        return console.log('Error loading client secret file:', err);
    }

    // Authorize a client with credentials, then call the Gmail API.
    authorize(JSON.parse(content), listLabels);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    try {
        const token = fs.readFileSync(TOKEN_PATH);

        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    } catch (error) {
        getNewToken(oAuth2Client, callback);
    }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                return console.error('Error retrieving access token', err);
            }

            oAuth2Client.setCredentials(token);

            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
    const gmail = google.gmail({ version: 'v1', auth });

    gmail.users.messages
        .send({
            auth,
            userId: 'me',
            requestBody: {
                raw: makeBody('innistry@gmail.com', 'innistry@gmail.com', 'test subject', 'test message'),
            },
        })
        .then(({ response }) => console.log('response', response))
        .catch(({ response }) => console.log('response', response));

    // gmail.users.labels.list(
    //     {
    //         userId: 'me',
    //     },
    //     (err, res) => {
    //         if (err) return console.log('The API returned an error: ' + err);
    //         const labels = res.data.labels;
    //         if (labels.length) {
    //             console.log('Labels:');
    //             labels.forEach((label) => {
    //                 console.log(`- ${label.name}`);
    //             });
    //         } else {
    //             console.log('No labels found.');
    //         }
    //     },
    // );
}

function makeBody(to, from, subject, message) {
    var str = [
        `Content-Type: text/plain; charset=\`UTF-8\`\n`,
        `MIME-Version: 1.0\n`,
        `Content-Transfer-Encoding: 7bit\n`,
        `to: ${to}\n`,
        `from: ${from}\n`,
        `subject: ${subject}\n\n`,
        message,
    ].join('');

    var encodedMail = new Buffer(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
    return encodedMail;
}
