'use strict';

const _ = require('lodash')
const readline = require('readline');

const MIN_BUY = 5

// const axios = require('axios')
// const crypto = require('crypto')

// console.log(process.argv)

const calculateBuys = () => {
  const amount = parseInt(process.argv[2])
  const start = parseInt(process.argv[3])
  const end = parseInt(process.argv[4])

  const numIntervals = (amount / MIN_BUY) - 1
  const interval = (end - start) / numIntervals

  const buys = []

  _.times(numIntervals + 1, (n) => {
    buys.push(start + (n * interval))
  })

  return buys
}

const main = () => {
  const buys = calculateBuys()

  console.log(buys)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('type EXECUTE to execute\r\n', (answer) => {
    if (answer === 'EXECUTE') {
      console.log('executing ...')
    }

    rl.close()
  })
}

main()

// module.exports.get = async (event, context) => {
//   const response = await CoinbasePro.get({path: `/accounts`})
//   console.log(response)
// };

// module.exports.buy = async (event, context) => {
//   const now = new Date()
//   const accountResponse = await CoinbasePro.get({path: `/accounts/${process.env.CBP_USD_ACCOUNT}`})
//   const availableUsd = parseFloat(accountResponse.available)
//   const buyBtcAmount = parseFloat(process.env.BUY_BTC_AMOUNT)
//   let buyResponse = null

//   if (availableUsd > buyBtcAmount) {
//     const body = {
//       client_oid: `BTCUSD_${Math.floor(now / 1000)}`,
//       type: 'market',
//       side: 'buy',
//       product_id: 'BTC-USD',
//       funds: buyBtcAmount,
//     }

//     buyResponse = await CoinbasePro.post({
//       path: `/orders`,
//       body
//     })
//   }

//   console.log(JSON.stringify({
//     availableUsd,
//     buyBtcAmount,
//     now: now.toISOString(),
//     buyResponse
//   }))
// };

// module.exports.deposit = async (event, context) => {
//   const time = new Date();
//   console.log(`deposit ${time}`);
// };

// class CoinbasePro {
//   static baseUri = 'https://api.pro.coinbase.com'

//   static async get({path}) {
//     const headers = this.generateHeaders({
//       method: 'GET',
//       path,
//     })

//     const response = await axios.get(
//       this.baseUri + path,
//       {headers}
//     );

//     return response.data
//   }

//   // static async deposit({amount}) {
//   //   this.post({
//   //     path: '/deposits/payment-methods',
//   //     body: {
//   //       amount: amount.toString(),
//   //       currency: 'USD',
//   //       payment_method: process.env.CBP_PAYMENT_METHOD_ID,
//   //     }
//   //   })
//   // }

//   // static async transfer({amount}) {
//   //   this.post({
//   //     path: '/profiles/transfer',
//   //     body: {
//   //       from: process.env.CBP_DEFAULT_PROFILE,
//   //       to: process.env.CBP_TRADING_PROFILE,
//   //       amount: amount.toString(),
//   //       currency: 'USD',
//   //     }
//   //   })
//   // }

//   static async post({path, body}) {
//     const headers = this.generateHeaders({
//       method: 'POST',
//       path,
//       body,
//     })

//     const response = await axios.post(
//       this.baseUri + path, 
//       body,
//       {headers}
//     );

//     return response.data
//   }

//   static generateHeaders({method, path, body}) {
//     const timestamp = Math.floor(Date.now() / 1000)
//     const bodyStr = body ? JSON.stringify(body) : '';

//     const what = timestamp + method + path + bodyStr
//     const key = Buffer.from(process.env.CBP_SECRET, 'base64');
//     const hmac = crypto.createHmac('sha256', key);
//     const signature = hmac.update(what).digest('base64');

//     return {
//       'CB-ACCESS-KEY': process.env.CBP_KEY,
//       'CB-ACCESS-TIMESTAMP': timestamp,
//       'CB-ACCESS-SIGN': signature,
//       'CB-ACCESS-PASSPHRASE': process.env.CBP_PASSPHRASE,
//     }
//   }

// }

