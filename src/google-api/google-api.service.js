const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { configService } = require('../config/config.service');

class GoogleApiService {
    #oAuth2Client;

    get scopes() {
        // If modifying these scopes, delete token.json.
        return ['https://www.googleapis.com/auth/gmail.send'];
    }

    async init() {
        try {
            // Load client secrets from a local file.
            const content = fs.readFileSync(configService.googleCredentialsPath);

            await this.authorize(JSON.parse(content));
        } catch (error) {
            return console.log('Error loading client secret file:', error);
        }
    }

    async sendMessage({ to, from, subject, message }) {
        const gmail = google.gmail({ version: 'v1', auth: this.#oAuth2Client });

        const str = [
            `Content-Type: text/plain; charset=\`UTF-8\`\n`,
            `MIME-Version: 1.0\n`,
            `Content-Transfer-Encoding: 7bit\n`,
            `to: ${to}\n`,
            `from: ${from}\n`,
            `subject: ${subject}\n\n`,
            message,
        ].join('');

        const raw = new Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

        return gmail.users.messages.send({
            auth: this.#oAuth2Client,
            userId: 'me',
            requestBody: { raw },
        });
    }

    listLabels() {
        const gmail = google.gmail({ version: 'v1', auth: this.#oAuth2Client });

        gmail.users.labels.list(
            {
                userId: 'me',
            },
            (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const labels = res.data.labels;
                if (labels.length) {
                    console.log('Labels:');
                    labels.forEach((label) => {
                        console.log(`- ${label.name}`);
                    });
                } else {
                    console.log('No labels found.');
                }
            },
        );
    }

    async authorize(credentials) {
        const { client_secret, client_id, redirect_uris } = credentials.web;
        this.#oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        try {
            const token = fs.readFileSync(configService.googleTokenPath);

            this.#oAuth2Client.setCredentials(JSON.parse(token));
        } catch (error) {
            await this.getNewToken();
        }
    }

    async getNewToken() {
        const authUrl = this.#oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this.scopes,
        });

        console.log('Authorize this app by visiting this url:', authUrl);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        return new Promise((resolve, reject) => {
            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                this.#oAuth2Client.getToken(code, (err, token) => {
                    if (err) {
                        reject(err);
                    }

                    this.#oAuth2Client.setCredentials(token);

                    // Store the token to disk for later program executions
                    fs.writeFile(configService.googleTokenPath, JSON.stringify(token), (err) => {
                        if (err) {
                            reject(err);
                        }

                        resolve(console.log('Token stored to', configService.googleTokenPath));
                    });
                });
            });
        });
    }
}

exports.googleApiService = new GoogleApiService();
