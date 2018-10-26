const express = require('express')
const app = express()
const port = 3000

app.get('/Results', (req, res) => res.send('RESULTS = CALCULATED!'))
app.get('/', (req, res) => res.send('DEBT = CALCULATED!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
