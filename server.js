const express = require('express')
const app = express()
const port = 4000

app.get('/Results', (req, res) => res.send('RESULTS = CALCULATED!'))
app.get('/', (req, res) => res.send('DEBT = CALCULATED!'))
app.get('/home', (req, res) => res.send('Calculate	Brainstorm	Stratigize'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
