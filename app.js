const express = require('express');
const index = require('./routes/index');
const session = require('express-session');
const port = 3000;
const app = express();
const startBot = require('./helpers/telegram/telegramBot.js').startBot;
const tunggakanBot = require('./helpers/telegram/telegramBot.js').tunggakanBot;
const botSendMessage = require('./helpers/telegram/telegramBot.js').botSendMessage;
const piutangBot = require('./helpers/telegram/telegramBot.js').piutangBot;
const changeToCurrency = require('./helpers/changeToCurrency.js');

startBot();
setInterval( function(){
  tunggakanBot();
  piutangBot()
}, 1000)

app.locals.changeToCurrency = changeToCurrency;
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended : false}))
app.use(session({
  secret : 'i love hacktiv8'
}))

app.get('/session', function (req, res) {
  res.send(req.session)
})

app.use('/', index)

app.listen(port, function() {
  console.log(`this is port ${port}...`)
})
