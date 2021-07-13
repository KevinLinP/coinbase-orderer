'use strict';

const _ = require('lodash')
const readline = require('readline');
const axios = require('axios')
const crypto = require('crypto')

const MIN_BUY = 5
const THROTTLE_MS = 5000

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

const executeBuys = async (buys) => {
  const price = _.first(buys)
  const now = new Date()
  const size = 1.0 * MIN_BUY / price

  const body = {
    client_oid: `BTCUSD_${Math.floor(now / 1000)}`,
    type: 'limit',
    side: 'buy',
    product_id: 'BTC-USD',
    price,
    size: size.toFixed(8)
  }

  const response = await CoinbasePro.post({
    path: `/orders`,
    body
  })

  console.log(response)

  const remaining = _.tail(buys)

  if (remaining.length > 0) {
    setTimeout(() => {
      executeBuys(remaining)
    }, THROTTLE_MS)
  }
}

const main = async () => {
  const buys = calculateBuys()

  console.log(buys)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('type EXECUTE to execute\r\n', (answer) => {
    if (answer === 'EXECUTE') {
      console.log('executing ...')
      executeBuys(buys)
    }

    rl.close()
  })
}

main()

class CoinbasePro {
  static baseUri = 'https://api.pro.coinbase.com'

  static async get({path}) {
    const headers = this.generateHeaders({
      method: 'GET',
      path,
    })

    const response = await axios.get(
      this.baseUri + path,
      {headers}
    );

    return response.data
  }

  static async post({path, body}) {
    const headers = this.generateHeaders({
      method: 'POST',
      path,
      body,
    })

    const response = await axios.post(
      this.baseUri + path, 
      body,
      {headers}
    );

    return response.data
  }

  static generateHeaders({method, path, body}) {
    const timestamp = Math.floor(Date.now() / 1000)
    const bodyStr = body ? JSON.stringify(body) : '';

    const what = timestamp + method + path + bodyStr
    const key = Buffer.from(process.env.CBP_SECRET, 'base64');
    const hmac = crypto.createHmac('sha256', key);
    const signature = hmac.update(what).digest('base64');

    return {
      'CB-ACCESS-KEY': process.env.CBP_KEY,
      'CB-ACCESS-TIMESTAMP': timestamp,
      'CB-ACCESS-SIGN': signature,
      'CB-ACCESS-PASSPHRASE': process.env.CBP_PASSPHRASE,
    }
  }

}

