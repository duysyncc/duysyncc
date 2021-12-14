import './styles.css';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { getWeb3 } from '../../constants/web3/getWeb3';
import { erc20 } from '../../constants/contracts/ecr20';
import { Tx8Swap } from '../../constants/contracts/Tx8Swap';

function Tx8SwapPage() {
  const [accounts, setAccount] = useState("Loading...");
  const [infoUsdt, setInfoUsdt] = useState({});
  const [infoTx8, setInfoTx8] = useState({});
  const [amountUsdtSwap, setAmountUsdtSwap] = useState(0);
  const [amountTxt8Swap, setAmountTxt8Swap] = useState(0);
  const tx8Address = "0xa39a336e89a33d24b5c8a0d594b1f2a78b255825"; // Token B
  const usdtAddress = "0x685aEF5Ce482700dF29Dd69b2931f86575CeFb40"; // Token A
  const swapAddress = "0x29798cA65E4Dd7Fc9A5f6735036b5F5D41b701c0";

  async function getInfoToken(addressToken) {
    let web3 = await getWeb3();
    let accounts = await web3.eth.getAccounts();
    let contract = await erc20(addressToken);
    let balance = await contract.methods.balanceOf(accounts[0]).call()
    let decimals = await contract.methods.decimals().call()
    let symbol = await contract.methods.symbol().call()
    return { "symbol": symbol, "decimals": decimals, "balance": balance, "address": addressToken }
  }
  async function setInfoTokenTx8Init() {
    let { symbol, decimals, balance } = await getInfoToken(tx8Address)
    setInfoTx8({
      symbol: symbol,
      decimals: decimals,
      balance: balance
    })
  }
  async function setInfoTokenUsdtInit() {
    let { symbol, decimals, balance } = await getInfoToken(usdtAddress)
    setInfoUsdt({
      symbol: symbol,
      decimals: decimals,
      balance: balance
    })
  }
  useEffect(() => {
    async function fetWeb3Init() {
      let web3 = await getWeb3();
      let accounts = await web3.eth.getAccounts();
      await setAccount(accounts[0]);
      await setInfoTokenTx8Init();
      await setInfoTokenUsdtInit();
    }
    fetWeb3Init();
  }, []);
  return (
    <div>
      <h3>{accounts}</h3>
      <div className="MainContent">
        <div className="MainCardTx8Swap">
          <h2 className="BalanceHead">
            Your TX8 balance :{(infoTx8.balance / 10 ** infoTx8.decimals).toFixed(2)}
            <br />
            Your USDT balance :{(infoUsdt.balance / 10 ** infoUsdt.decimals).toFixed(2)}
          </h2>
          <h2>Swap TX8 to USDT</h2>
          <div className="SwapPanel">
            <input type="number" className='inputToken' value={amountTxt8Swap} onChange={(event) => {
              let inputToken = event.target.value;
              setAmountTxt8Swap(inputToken);
            }} />
            <nav className='amount'>{amountTxt8Swap * 2} USDT</nav>
            <button id='ButtonSwap' onClick={async () => {
              let contractTx8 = await erc20(tx8Address);
              let allowanceTx8 = await contractTx8.methods.allowance(accounts, swapAddress).call();
              if (+amountTxt8Swap * 10 ** 18 > +allowanceTx8) {
                alert("Approve token TX8 ")
                await contractTx8.methods.approve(swapAddress, Web3.utils.toBN(BigInt(10 ** 50).toString())).send({ from: accounts })
              }
              alert("Swap now")
              try {
                let contract = await Tx8Swap(swapAddress);
                var data = await contract.methods.swapTokenBtoTokenA(
                  Web3.utils.toBN(BigInt(amountTxt8Swap * 10 ** 18).toString()),
                ).send({ from: accounts })
                alert("Swap Success!, Check on https://mumbai.polygonscan.com/tx/" + data.transactionHash)
              } catch (error) {
                console.log("Error")
              }
              await setInfoTokenTx8Init();
              await setInfoTokenUsdtInit();
            }}>Swap Now</button>
          </div>
          <hr />
          <h2>Swap USDT to TX8</h2>
          <div className="SwapPanel">
            <input type="number" className='inputToken' value={amountUsdtSwap} onChange={(event) => {
              let inputToken = event.target.value;
              setAmountUsdtSwap(inputToken);
            }} />
            <nav className='amount'>{amountUsdtSwap / 2} TX8</nav>
            <button id='ButtonSwap' onClick={async () => {
              let contractUsdt = await erc20(usdtAddress);
              let allowanceUsdt = await contractUsdt.methods.allowance(accounts, swapAddress).call();
              if (+amountUsdtSwap * 10 ** 18 > +allowanceUsdt) {
                alert("Approve token TX8 ")
                await contractUsdt.methods.approve(swapAddress, Web3.utils.toBN(BigInt(10 ** 50).toString())).send({ from: accounts })
              }
              alert("Swap now")
              try {
                let contract = await Tx8Swap(swapAddress);
                var data = await contract.methods.swapTokenAtoTokenB(
                  Web3.utils.toBN(BigInt(amountUsdtSwap * 10 ** 18).toString()),
                ).send({ from: accounts })
                alert("Swap Success!, Check on https://mumbai.polygonscan.com/tx/" + data.transactionHash)
              } catch (error) {
                console.log("Error")
              }
              await setInfoTokenTx8Init();
              await setInfoTokenUsdtInit();
            }}>Swap Now</button>
          </div>
          <hr />
        </div>
      </div>
    </div >
  );
}

export default Tx8SwapPage;
