import { ethers } from 'ethers'
import mergeAbi from '../abi/mergeAbi.js'

const mergeAddress = '0xc3f8a0F5841aBFf777d3eefA5047e8D413a1C9AB'
const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/5mdbPaPYe-ENWnaTazdokU1oyR1bUy_w')
const contract = new ethers.Contract(mergeAddress, mergeAbi, provider)

export default async function massUpdate(event) {
  const massTotal = await contract._massTotal()
  const tokenSupply = await contract.totalSupply()
  const [tokenIdSmall, tokenIdLarge, combinedMass] = event.args
  const previousBlockNumber = event.blockNumber - 1
  const smallMass = await contract.massOf(tokenIdSmall, { blockTag: previousBlockNumber })
  const largeMass = combinedMass - smallMass
  sendTweet(smallMass, largeMass, combinedMass, tokenIdSmall, tokenIdLarge, tokenSupply.toNumber(), massTotal.toNumber())
}

// export default async () =>
// contract.on('MassUpdate', async (_, __, ___, event) => {
//   const massTotal = await contract._massTotal()
//   const tokenSupply = await contract.totalSupply()
//   const [tokenIdSmall, tokenIdLarge, combinedMass] = event.args
//   const previousBlockNumber = event.blockNumber - 1
//   const smallMass = await contract.massOf(tokenIdSmall, { blockTag: previousBlockNumber })
//   const largeMass = combinedMass - smallMass
//   sendTweet(smallMass, largeMass, combinedMass, tokenIdSmall, tokenIdLarge, tokenSupply.toNumber(), massTotal.toNumber())
// })
