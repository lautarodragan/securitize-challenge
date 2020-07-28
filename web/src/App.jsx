import { Button, TextField, Paper, Container, Select, MenuItem } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded'
import EditIcon from '@material-ui/icons/Edit'
import ReportProblemRoundedIcon from '@material-ui/icons/ReportProblemRounded'
import React, { useState, useEffect } from 'react'

import './App.css'

export function App() {
  const [address, setAddress] = useState('')
  const [rateUsd, setRateUsd] = useState('?')
  const [rateEur, setRateEur] = useState('?')
  const [addressIsOld, setAddressIsOld] = useState(null)
  const [addressBalance, setAddressBalance] = useState(null)
  const [fiatCurrency, setFiatCurrency] = useState('usd')

  const onGetRates = () => {
    fetch(`http://localhost:8000/rates/usd-eth`).then(_ => _.json()).then(setRateUsd)
    fetch(`http://localhost:8000/rates/eur-eth`).then(_ => _.json()).then(setRateEur)
  }

  const onSignOut = () => {
    setAddress('')
    setAddressBalance(null)
    setAddressIsOld(null)
  }

  useEffect(() => {
    onGetRates()
  }, [])

  useEffect(() => {
    if (!address)
      return

    fetch(`http://localhost:8000/wallets/${address}/is-old`).then(_ => _.json()).then(setAddressIsOld)
    fetch(`http://localhost:8000/wallets/${address}/balance?currency=${fiatCurrency}`).then(_ => _.json()).then(setAddressBalance)
  }, [address, fiatCurrency])

  return (
    <div className="App">
      <header className="App-header">
        Wallet Analytics
      </header>
      <main>
        <Container>
          { !address && <SignIn onSignIn={setAddress} /> }
          { addressBalance && addressIsOld && <AccountInfo isOld={addressIsOld.isOld} balance={addressBalance.balance} fiatCurrency={fiatCurrency} onSignOut={onSignOut} /> }
          <EthPrice
            exchangeRate={fiatCurrency === 'usd' ? rateUsd.exchangeRate : rateEur.exchangeRate}
            fiatCurrency={fiatCurrency}
            onFiatCurrencyChange={setFiatCurrency}
          />
        </Container>
      </main>
    </div>
  )
}

const SignIn = ({ onSignIn }) => {
  const [address, setAddress] = useState('')
  return (
    <section>
      <h1>Load Account</h1>
      <TextField
        placeholder="0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae"
        onChange={(event) => setAddress(event.currentTarget.value)}
        value={address}
      />
      <Button color="primary" onClick={() => onSignIn(address)}>Load Account</Button>
    </section>
  )
}

const AccountInfo = ({ isOld, balance, fiatCurrency, onSignOut }) => (
  <section className="account-info">
    <h1>Account Info</h1>
    <AccountAge isOld={isOld}/>
    <section>Account Balance: {balance} <span className="currency">{fiatCurrency}</span></section>
    <div><Button onClick={onSignOut}>Sign Out</Button></div>
  </section>
)

const AccountAge = ({ isOld }) => (
  <section className="account-age">
    { isOld ? <AccountAgeOld/> : <AccountAgeYoung/> }
  </section>
)

const AccountAgeOld = () => (
  <>
    <ReportProblemRoundedIcon style={{ color: 'orange' }} />
    <span>This account is old.</span>
  </>
)

const AccountAgeYoung = () => (
  <>
    <DoneRoundedIcon  style={{ color: 'green' }} />
    <span>This account is young.</span>
  </>
)

const EthPrice = ({ fiatCurrency, onFiatCurrencyChange, exchangeRate }) => {
  const [edit, setEdit] = useState(false)

  const Display = () => (
    <>
      <span>{exchangeRate}</span>
      <Select
        value={fiatCurrency}
        onChange={(event) => onFiatCurrencyChange(event.target.value)}
      >
        <MenuItem value='usd'>USD</MenuItem>
        <MenuItem value='eur'>EUR</MenuItem>
      </Select>
      <Button onClick={() => setEdit(true)}><EditIcon/></Button>
    </>
  )

  const Edit = () => (
    <>
      <TextField value={exchangeRate}/>
      <span>{fiatCurrency}</span>
      <Button onClick={() => setEdit(false)}><DoneRoundedIcon/></Button>
      <Button onClick={() => setEdit(false)}><CloseIcon/></Button>
    </>
  )

  return (
    <section className="eth-price">
      <h3>ETH Price</h3>
      <main>
        { !edit && <Display/> }
        { edit && <Edit/> }
      </main>
    </section>
  )
}
