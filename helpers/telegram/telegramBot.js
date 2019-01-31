const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
require('dotenv').config()

const helpString = 'butuh bantuan? ini daftar perintah yang kamu bisa pakai\n/command --> menampilkan keyboard command\n/chatid --> untuk melihat chat id kamu\n/saldo --> untuk mengecek saldo kamu\n/tunggakan --> untuk melihat daftar tunggakan kamu\n/topup --> untuk menambah saldo kamu'

const command = Markup.inlineKeyboard([
  Markup.callbackButton('lihat Chat Id', 'chatId'),
  Markup.callbackButton('lihat saldo', 'saldo'),
  Markup.callbackButton('lihat tunggakan', 'tunggakan'),
  Markup.callbackButton('bantuan', 'help'),
  Markup.callbackButton('close', 'delete')
], {
  columns: 1
})

const bot = new Telegraf(process.env.BOT_TOKEN)

function sendCommand(ctx) {
  return ctx.reply('ada lagi yang bisa saya bantu?', Extra.markup(command))
}

function startBot() {
  bot.start((ctx) => {
    console.log('sombody press start!')
    console.log(ctx.from);
    ctx.reply(`Selamat datang di Splitter, ${ctx.from.username} ! 🥰🥰\nchat id kamu adalah :\n   ${ctx.from.id}\nmasukan chat id kamu ke form registrasi.\njika kamu butuh bantuan, tekan /help di chat ini atau ketik perintah /help di chat.
    `, Extra.markup(command));
  })
  
  bot.help((ctx) => {
    ctx.reply(helpString)
    .then( () => {
      sendCommand(ctx)
    })
    .catch( err => {
      console.log(err)
    })
  })
  
  bot.action('help', (ctx) => {
    ctx.reply(helpString)
     .then(() => {
         sendCommand(ctx)
       })
       .catch(err => {
         console.log(err)
       })
  })
  
  bot.action('chatId', (ctx) => {
    ctx.reply(`username kamu : ${ctx.from.username}\nchat id kamu : ${ctx.from.id}`)
    .then( () => {
      sendCommand(ctx);
    })
    .catch( err => {
      console.log(err)
    })
  })
    
  bot.on('message', (ctx) =>{
    ctx.reply('ada yang bisa saya bantu?', Extra.markup(command))
  })
  
  bot.action('delete', ({
    deleteMessage
  }) => deleteMessage())
  
  bot.launch()
}

function saldoBot(data){
  bot.action('saldo', (ctx) => {
    ctx.reply(`saldo kamu : ${ctx}`)
      .then(() => {
        sendCommand(ctx)
      })
      .catch(err => {
        console.log(err)
      })
  })
}

function tunggakanBot(data){
  bot.action('tunggakan', (ctx) => {
    ctx.reply(`tunggakan kamu : ${data.hehe}`)
      .then(() => {
        sendCommand(ctx)
      })
      .catch(err => {
        console.log(err)
      })
  })
}

module.exports = {startBot, saldoBot, tunggakanBot};