import fetch from 'node-fetch'

export const Etherscan = ({ url = 'https://api.etherscan.io/api', apiKey }) => {
  const getBalance = address => fetch(`${url}?module=account&action=balance&address=${address}&apiKey=${apiKey}`).then(_ => _.json())

  return {
    getBalance,
  }
}
