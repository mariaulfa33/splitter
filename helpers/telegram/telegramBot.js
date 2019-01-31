const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const Markup = require('telegraf/markup')
const Model = require('../../models')
const Sequelize = require('sequelize')
const changeToCurrency = require('../../helpers/changeToCurrency.js')
require('dotenv').config()

const helpString = 'butuh bantuan? ini daftar perintah yang kamu bisa pakai\n/command --> menampilkan keyboard command\n/chatid --> untuk melihat chat id kamu\n/saldo --> untuk mengecek saldo kamu\n/tunggakan --> untuk melihat daftar tunggakan kamu\n/topup --> untuk menambah saldo kamu'

const command = Markup.inlineKeyboard([
  Markup.callbackButton('lihat Chat Id', 'chatId'),
  Markup.callbackButton('lihat total tunggakan', 'tunggakan'),
  Markup.callbackButton('bantuan', 'help'),
  Markup.callbackButton('close', 'delete')
], {
  columns: 1
})

const bot = new Telegraf(process.env.BOT_TOKEN)

function sendCommand(ctx) {
  return ctx.reply('ada lagi yang bisa saya bantu?', Extra.markup(command))
}

function botSendMessage(chatId, message){
  bot.telegram.sendMessage(chatId, message)
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


function tunggakanBot(){
  let result = 'total tunggakan :\n'
  bot.action('tunggakan', (ctx) => {
    Model.User.findOne({
      where : {
        chatId: String(ctx.update.callback_query.from.id)
      }
    })
    .then ( data => {
      return Model.UserTransaction.findAll({
        where: {
          UserId: data.id
        },
        include: [{
          model: Model.Transaction,
          include: [{
            model: Model.User
          }]
        }]
      })   
    })
    .then(data => {
      // res.send(data)
      let count = 1;
      data.forEach( e => {
        console.log(e)
        result += `${count}. ${e.dataValues.Transaction.dataValues.name} sebesar ${e.dataValues.bill} kepada ${e.dataValues.Transaction.dataValues.User.dataValues.firstname}`
        count++
      })
      ctx.reply(result)
    })
    .catch(err => {
      console.log(err)
    })
  })
}

// function piutangBot() {
//   let result = `list piutang kamu:\n`;
//   bot.action('piutang', (ctx) => {
//      Model.User.findOne({
//       where: {
//         chatId: String(ctx.update.callback_query.from.id)
//       }
//     })
//     .then(data => {
//       return Model.Transaction.findAll({
//         where: {
//           UserId: data.id
//         },
//         include: [{
//           model: Model.User
//         }]
//       })
//     })
//     .then(data => {
//       // res.send(data)
//       let count = 1;
//       data.forEach(e => {
//         console.log(e)
//         result += `${count}. `
//       })
//       ctx.reply(result)
//     })
//     .catch(err => {
//       console.log(err)
//     })
//  })
// }


module.exports = {startBot, tunggakanBot, botSendMessage};