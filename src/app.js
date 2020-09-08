const express = require('express');
const { configService } = require('./config/config.service');
const { sendEmailJob } = require('./jobs/send-email.job');
const { googleApiService } = require('./google-api/google-api.service');

async function bootstrap() {
    try {
        const app = express();
        sendEmailJob.register();
        await googleApiService.init();

        /**
         * Here should be POST of course - I stay it so just for the more simple test via browser
         */
        app.get('/send-mail', ({ query: { to, from, subject, message } }, res) => {
            sendEmailJob.add({ to, from, subject, message });

            res.send(`
            <h3>Started processing sending email with the next parameters</h3>
        
            <p>to: ${to}</p>
            <p>from: ${from}</p>
            <p>subject: ${subject}</p>
            <p>message: ${message}</p>
            `);
        });

        app.listen(configService.port, () => {
            const to = encodeURIComponent('innistry@gmail.com');
            const from = encodeURIComponent('innistry@gmail.com');
            const subject = encodeURIComponent('testing node js application');
            const message = encodeURIComponent('check code here https://github.com/innistry/gmail-send-message');

            console.info(
                `Run command with http://localhost:${configService.port}/send-mail?to=${to}&from=${from}&subject=${subject}&message=${message}`,
            );
        });
    } catch (error) {
        console.error(error);
    }
}
bootstrap();
