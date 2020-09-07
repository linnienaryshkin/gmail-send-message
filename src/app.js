const express = require('express');
const app = express();
const port = 3000;

/**
 * Here should be POST of course - I stay it so just for more simple test via browser
 */
app.get('/send-mail', ({ query: { to, from, subject, message } }, res) => {
    console.log('title', title);
    console.log('msg', msg);
    res.send('Hello World! title = ' + title);
});

app.listen(port, () => {
    console.log(`Run command on http://localhost:${port}/send-mail`);
});

/**
 * Client ID
 * 737560249989-5drhspr9p5n348i14678kkltmhe36f0g.apps.googleusercontent.com
 *
 * Client Secret
 * cZflDNrh9JuEr6VcpSJst1gN
 */

require('./google-api');
