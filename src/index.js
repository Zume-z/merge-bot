import dotenv from 'dotenv'
import sharp from 'sharp'
import axios from 'axios'
import Twitter from 'twitter'
import { ethers } from 'ethers'
import mergeAbi from '../abi/mergeAbi.js'
dotenv.config()
const mergeAddress = '0xc3f8a0F5841aBFf777d3eefA5047e8D413a1C9AB'
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_PRIVATE_KEY)
const contract = new ethers.Contract(mergeAddress, mergeAbi, provider)
const OPENSEA_API_URL = 'https://api.opensea.io/wyvern/v1'
const openseaApi = axios.create({ baseURL: OPENSEA_API_URL, headers: { 'X-API-KEY': process.env.OPENSEA_KEY } })
openseaApi.interceptors.request.use((config) => (config.paramsSerializer = (params) => qs.stringify(params, { arrayFormat: 'repeat' })) && config)

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

const onMassUpdate = async (_, __, ___, event) => {
  try {
    const tokenSupply = await contract.totalSupply()
    const [tokenIdSmall, tokenIdLarge, combinedMass] = event.args
    const previousBlockNumber = event.blockNumber - 1
    const smallMass = await contract.massOf(tokenIdSmall, { blockTag: previousBlockNumber })
    const largeMass = combinedMass - smallMass
    const getMergeSvgUrl = () => {
      return openseaApi
        .get(`https://api.opensea.io/api/v1/asset/0xc3f8a0F5841aBFf777d3eefA5047e8D413a1C9AB/${tokenIdLarge}`)
        .then((res) => res.data.image_url)
    }
    const mergeSvgUrl = await getMergeSvgUrl()
    const imageAsSvgString = (await openseaApi.get(mergeSvgUrl)).data
    const imageAsPngBuffer = await sharp(Buffer.from(imageAsSvgString)).png().toBuffer()

    client.post('media/upload', { media: imageAsPngBuffer }, async function (error, media, response) {
      if (!error) {
        const status = {
          status:
            `m(${smallMass}) #${tokenIdSmall} + m(${largeMass}) #${tokenIdLarge} => m(${combinedMass}) #${tokenIdLarge}.` +
            '\n' +
            `${tokenSupply}/28990 merge remain.` +
            '\n' +
            `https://opensea.io/assets/0xc3f8a0f5841abff777d3eefa5047e8d413a1c9ab/${tokenIdLarge}
      `,
          media_ids: media.media_id_string,
        }
        client.post('statuses/update', status, function (error, tweet, response) {
          if (!error) {
            console.log('Successful Tweet')
          } else if (error) {
            console.log(error)
          }
        })
      }
    })
  } catch (err) {
    console.log(err)
  }
}
contract.on('MassUpdate', onMassUpdate)
