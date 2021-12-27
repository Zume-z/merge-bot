import dotenv from 'dotenv'
import Twitter from 'twitter'
import { ethers } from 'ethers'
import mergeAbi from '../abi/mergeAbi.js'
const mergeAddress = '0xc3f8a0F5841aBFf777d3eefA5047e8D413a1C9AB'
const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/5mdbPaPYe-ENWnaTazdokU1oyR1bUy_w')
const contract = new ethers.Contract(mergeAddress, mergeAbi, provider)
dotenv.config()

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

const onMassUpdate = async (_, __, ___, event) => {
  const massTotal = await contract._massTotal()
  const tokenSupply = await contract.totalSupply()
  const [tokenIdSmall, tokenIdLarge, combinedMass] = event.args
  const previousBlockNumber = event.blockNumber - 1
  const smallMass = await contract.massOf(tokenIdSmall, { blockTag: previousBlockNumber })
  const largeMass = combinedMass - smallMass
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

contract.on('MassUpdate', onMassUpdate)



const main = async () => {
  const mergeSvgUrl = await getMergeSvgUrl()
  const imageAsSvgString = (await axios.get(mergeSvgUrl)).data
  const imageAsPngBuffer = await sharp(Buffer.from(imageAsSvgString)).png().toBuffer()

  client.post('media/upload', { media: imageAsPngBuffer }, async function (error, media, response) {
    if (!error) {
      const tokenSupply = await contract.totalSupply()
      const tokenIdSmall = 28993
      const tokenIdLarge = 1003
      const smallMass = 10
      const largeMass = 100
      const combinedMass = 110

      const status = {
        status:
          `m(${smallMass}) #${tokenIdSmall} + m(${largeMass}) #${tokenIdLarge}. => m$(${combinedMass}) #${tokenIdLarge}.` +
          '\n' +
          `${tokenSupply}/28990 merge remain.` +
          '\n' +
          `https://opensea.io/assets/0xc3f8a0f5841abff777d3eefa5047e8d413a1c9ab/${tokenIdLarge}
      `,
        media_ids: media.media_id_string,
      }

      client.post('statuses/update', status, function (error, tweet, response) {
        if (!error) {
          console.log(tweet)
        }
      })
    }
  })
}

main()
// const imageAsBuffer = getImageAsBuffer(event.tokenId)