import { Button, TextField } from '@material-ui/core'
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

  const onGetAddressIsOld = () => {
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
        <section>
          <TextField
            placeholder="0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"
            onChange={(event) => setAddress(event.currentTarget.value)}
            value={address}
          />
          <Button color="primary" onClick={onGetAddressIsOld}>Is Old?</Button>
          <span>{addressIsOld?.isOld ? 'Yes' : 'No'}</span>
        </section>
        <section>
          <h2>Rates</h2>
          <Button color="primary" onClick={onGetRates}>Refresh Rates</Button>
          <section>
            <h3>USD-ETH</h3>
            <label>1 eth = {rateUsd.exchangeRate} usd</label>
          </section>
          <section>
            <h3>EUR-ETH</h3>
            <label>1 eth = {rateEur.exchangeRate} eur</label>
          </section>
        </section>
      </main>
    </div>
  )
}
