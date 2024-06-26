require('dotenv/config')

const {
  API_HASH,
  API_ID,
  BOT_TOKEN } = process.env

if ( !API_ID || !API_HASH || !BOT_TOKEN ) {
  throw new Error('Missing required credentials!!')
}

const input = require('input')
const { registerHandlers } = require('./src/userbot/utils')

const bot = require('./src/bot')
const userbot = require('./src/userbot')

;(async () => {
  await userbot.connect()
  const isAuthorized = await userbot.isUserAuthorized()

  if ( !isAuthorized ) {
    await userbot.start({
      phoneNumber: async () => await input.text("Nomor Ponsel (+62) : "),
      password: async () => await input.text("Kata Sandi : "),
      phoneCode: async () => await input.text("Kode Verifikasi : "),
      onError: err => console.log(err.message)
    });

    console.log(userbot.session.save())
    process.exit(1)
  }

  let myInfo = await userbot.getMe()
  userbot.me = myInfo.id

  await userbot.getDialogs({})
  await registerHandlers(userbot)

  bot.start({
    drop_pending_updates: true,
    allowed_updates: [
      'inline_query',
      'callback_query',
      'chosen_inline_result',
    ]
  })

  console.log('Tosca Userbot is up and running!!!')
})();
