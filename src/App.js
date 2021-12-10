import './App.css';
import React, { useState, useEffect } from 'react';
import SwapPage from "./pages/Swap"
import LiquidityPage from "./pages/Liquidity"
import FaucetPage from './pages/Faucet';
function App() {
  const [url, setUrl] = useState("/Swap")
  return (
    <div className="App">
      <ul className="router">
        <li className="Logo">Hello Swap</li>
        <li onClick={() => {
          setUrl("/Swap")
        }}>Swap</li>

        <li onClick={() => {
          setUrl("/Liquidity")
        }}>Liquidity</li>

        <li onClick={() => {
          setUrl("/Faucet")
        }}>Faucet</li>
      </ul>
      <div className="main">
        {url == "/Swap" ? <SwapPage /> : null}
        {url == "/Liquidity" ? <LiquidityPage /> : null}
        {url == "/Faucet" ? <FaucetPage /> : null}
      </div>
    </div>
  );
}

export default App;
