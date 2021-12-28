import "./App.css";
import React, { useState, useEffect } from "react";
import SwapPage from "./pages/Swap";
import LiquidityPage from "./pages/Liquidity";
import FaucetPage from "./pages/Faucet";
import StakePage from "./pages/Stake";
import Tx8SwapPage from "./pages/Tx8Swap";
import CrawlPage from "./pages/toolcrawlliquity";
function App() {
  // const [url, setUrl] = useState("/Swap")
  const [url, setUrl] = useState("/Swap");
  return (
    <div className="App">
      <ul className="router">
        <li className="Logo">Hello Swap</li>
        <li
          onClick={() => {
            setUrl("/Swap");
          }}
        >
          Swap
        </li>

        <li
          onClick={() => {
            setUrl("/Liquidity");
          }}
        >
          Liquidity
        </li>

        <li
          onClick={() => {
            setUrl("/Stake");
          }}
        >
          Stake
        </li>

        <li
          onClick={() => {
            setUrl("/Tx8Swap");
          }}
        >
          Tx8Swap
        </li>

        <li
          onClick={() => {
            setUrl("/Faucet");
          }}
        >
          Faucet
        </li>

        <li
          onClick={() => {
            setUrl("/CrawlPage");
          }}
        >
          CrawlPage
        </li>
      </ul>
      <div className="main">
        {url == "/Swap" ? <SwapPage /> : null}
        {url == "/Liquidity" ? <LiquidityPage /> : null}
        {url == "/Faucet" ? <FaucetPage /> : null}
        {url == "/Stake" ? <StakePage /> : null}
        {url == "/Tx8Swap" ? <Tx8SwapPage /> : null}
        {url == "/CrawlPage" ? <CrawlPage /> : null}
      </div>
    </div>
    // <CrawlPage />
  );
}

export default App;
