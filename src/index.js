// import event from './event.js'
import massUpdate from './massUpdate.js'
import dotenv from 'dotenv'
import Twitter from 'twitter'
dotenv.config()

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

async function main() {
  await massUpdate()
  await sendTweet()
  const params = {
    status:
      `m(${smallMass}) #${tokenIdSmall} merged with m(${largeMass}) #${tokenIdLarge}.` +
      '\n \n' +
      `${tokenSupply}/28990 merge remain.

    https://opensea.io/assets/0xc3f8a0f5841abff777d3eefa5047e8d413a1c9ab/${tokenIdLarge}
  `,
  }
  client.post('statuses/update', params).catch((err) => console.log(err))
}
main().catch((err) => console.log(err))
