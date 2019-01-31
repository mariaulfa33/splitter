const express = require('express');
const index = require('./routes/index');
const port = 3000;
const app = express();
const startBot = require('./helpers/telegram/telegramBot.js').startBot;
const saldoBot = require('./helpers/telegram/telegramBot.js').saldoBot;
const tunggakanBot = require('./helpers/telegram/telegramBot.js').tunggakanBot;

// startBot();
// saldoBot()
// tunggakanBot()

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended : false}))
app.use('/', index)

app.listen(port, function() {
  console.log(`this is port ${port}...`)
})
