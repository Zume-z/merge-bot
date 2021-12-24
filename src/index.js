import fs from 'fs'
import dotenv from 'dotenv'
import Twitter from 'twitter'
import { ethers } from 'ethers'
import mergeAbi from '../abi/mergeAbi.js'
import fetch from 'node-fetch';
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

// const onMassUpdate = async () => {
//   const tokenSupply = await contract.totalSupply()
//   const tokenIdSmall = 28993
//   const tokenIdLarge = 1003
//   const smallMass = 10
//   const largeMass = 100
//   const params = {
//     status:
//       `m(${smallMass}) #${tokenIdSmall} merged with m(${largeMass}) #${tokenIdLarge}.` +
//       '\n \n' +
//       `${tokenSupply}/28990 merge remain.

//     https://opensea.io/assets/0xc3f8a0f5841abff777d3eefa5047e8d413a1c9ab/${tokenIdLarge}

//   `,
//   }
//   client.post('statuses/update', params).catch((err) => console.log(err))
// }

// const data = fs.readFileSync('./file.svg')
// const data = fs.unlinkSync('./file.svg')

// client.post('media/upload', { media: data }, async function (error, media, response) {
//   if (!error) {
//     const tokenSupply = await contract.totalSupply()
//     const tokenIdSmall = 28993
//     const tokenIdLarge = 1003
//     const smallMass = 10
//     const largeMass = 100
//     const combinedMass = 110
//     const status = {
//       status:
//         `m(${smallMass}) #${tokenIdSmall} merged with m(${largeMass}) #${tokenIdLarge}.` +
//         '\n \n' +
//         `m #${tokenIdLarge} mass = ${combinedMass}.` +
//         '\n \n' +
//         `${tokenSupply}/28990 merge remain.

//     https://opensea.io/assets/0xc3f8a0f5841abff777d3eefa5047e8d413a1c9ab/${tokenIdLarge}

//   `,
//       media_ids: media.media_id_string, // Pass the media id string
//     }

//     client.post('statuses/update', status, function (error, tweet, response) {
//       if (!error) {
//         console.log(tweet)
//       }
//     })
//   }
// })

// Image Downloader
// -------------------
// const options = {
//   url: 'https://storage.opensea.io/files/5fc152f99cd74428aae6d009811bbaea.svg',
//   dest: './images/image.svg',      // will be saved to /path/to/dest/photo.jpg

// }

// download.image(options)
//   .then(({ filename }) => {
//     console.log('Saved to', filename)  // saved to /path/to/dest/photo.jpg
//   })
//   .catch((err) => console.error(err))



//Get image storage URL
// ----------------------
fetch('https://api.opensea.io/api/v1/asset/0xc3f8a0F5841aBFf777d3eefA5047e8D413a1C9AB/19538', {method: 'GET'})
  .then(res => res.json())
  .then(res => console.log(res.image_url))
  .catch(err => console.error(err));