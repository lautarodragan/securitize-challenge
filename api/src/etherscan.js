const fetch = require('node-fetch')

module.exports.Etherscan = ({ url = 'https://api.etherscan.io/api', apiKey }) => {
  const getBalance = address => fetch(`${url}?module=account&action=balance&address=${address}&apiKey=${apiKey}`).then(_ => _.json())

  return {
    getBalance,
  }
}
