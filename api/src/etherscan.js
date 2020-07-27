import fetch from 'node-fetch'

export const Etherscan = ({ url = 'https://api.etherscan.io/api', apiKey }) => {
  const getJson = url => {
    console.log('GET', url)
    return fetch(url).then(_ => _.json())
  }

  const getBalance = address => getJson(`${url}?module=account&action=balance&address=${address}&apiKey=${apiKey}`)

  const getBlockNumberByTimestamp = timestamp => getJson(`${url}?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apiKey=${apiKey}`)

  return {
    getBalance,
    getBlockNumberByTimestamp,
  }
}
