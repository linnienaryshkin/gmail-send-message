const express = require('express');
const { configService } = require('./config/config.service');
const { sendEmailJob } = require('./jobs/send-email.job');

const app = express();

/**
 * Here should be POST of course - I stay it so just for more simple test via browser
 */
app.get('/send-mail', ({ query: { to, from, subject, message } }, res) => {
    console.log('title', title);
    console.log('msg', msg);
    res.send('Hello World! title = ' + title);
});

app.listen(configService.port, () => {
    console.log(`Run command on http://localhost:${configService.port}/send-mail`);
});

sendEmailJob.register();
sendEmailJob.add(123);

// import './google-api';
