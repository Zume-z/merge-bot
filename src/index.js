import event from './event.js'
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

const params = {}

client.post('statuses/update', { status: 'tweet' }, function (error, tweet, response) {
  if (!error) {
    console.log(tweet)
  } else {
    console.log(error)
  }
})

const tweet = async () => {
  const [smallMass, largeMass, combinedMass, tokenIdSmall, tokenIdLarge, tokenSupply, massTotal] = await massUpdate(event)

  console.log(`
m(${smallMass}) #${tokenIdSmall} merged with m(${largeMass}) #${tokenIdLarge}
m #${tokenIdLarge} new mass = ${combinedMass}
${tokenSupply}/28,388 merge remain.
${massTotal}/312729 mass remains.
  `)
}
tweet()

async function main() {
  const [smallMass, largeMass, combinedMass, tokenIdSmall, tokenIdLarge, tokenSupply, massTotal] = await massUpdate(event)
  const params = {
    status: `
    m(${smallMass}) #${tokenIdSmall} merged with m(${largeMass}) #${tokenIdLarge}
    m #${tokenIdLarge} new mass = ${combinedMass}
    ${tokenSupply}/28,388 merge remain.
    ${massTotal}/312729 mass remains.
      `,
  }

  await client.post('account/update_profile', params)
  console.log('🎉 Success! Updated Twitter bio/location and website')
}

main().catch((err) => console.log(err))

// async function grabGithubData(): Promise<string> {
//   const browser = await puppeteer.launch()
//   const page = await browser.newPage()
//   await page.goto('https://github.com/users/erikch/contributions?from=2021-01-01')
//   let contribs = await page.$$eval('[data-count]', (val) => val.reduce((acc, val) => acc + +val.getAttribute('data-count')!, 0))
//   const currentYear = format(new Date(), 'yyyy')
//   await browser.close()
//   return `${currentYear} Github Contributions: ${contribs}`
// }
