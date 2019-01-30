const express = require('express')
const index = require('./routes/index')
const port = 3000
const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended : false}))
app.use('/', index)

app.listen(port, function() {
  console.log(`this is port ${port}...`)
})