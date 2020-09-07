const express = require('express')
const app = express()
const port = 3000

/**
 * Here should be POST of course - I stay it so just for more simple test via browser
 */
app.get('/send-mail', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Run command on http://localhost:${port}/send-mail`)
})
