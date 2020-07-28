import { Button, TextField, Paper, Container } from '@material-ui/core'
import React, { useState, useEffect } from 'react'

import './App.css'

export function App() {
  const [address, setAddress] = useState('')
  const [rateUsd, setRateUsd] = useState('?')
  const [rateEur, setRateEur] = useState('?')
  const [addressIsOld, setAddressIsOld] = useState(null)

  const onGetRates = () => {
    fetch(`http://localhost:8000/rates/usd-eth`).then(_ => _.json()).then(setRateUsd)
    fetch(`http://localhost:8000/rates/eur-eth`).then(_ => _.json()).then(setRateEur)
  }

  const onLoadAddress = () => {
    fetch(`http://localhost:8000/wallets/${address}/is-old`).then(_ => _.json()).then(setAddressIsOld)
  }

  useEffect(() => {
    onGetRates()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        Wallet Analytics
      </header>
      <main>
        <Container>
          <section>
            <h1>Account Address</h1>
            <TextField
              placeholder="0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"
              onChange={(event) => setAddress(event.currentTarget.value)}
              value={address}
            />
            <Button color="primary" onClick={onLoadAddress}>Load Address</Button>
          </section>
          <section>
            <span>{addressIsOld?.isOld ? 'Yes' : 'No'}</span>
          </section>
          <Paper>
            <h3>ETH Price</h3>
            <div>{rateUsd.exchangeRate} USD</div>
            <div>{rateEur.exchangeRate} EUR</div>
          </Paper>
        </Container>
      </main>
    </div>
  )
}
