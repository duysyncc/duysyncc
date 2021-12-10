import './styles.css';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { getWeb3 } from '../../constants/web3/getWeb3';
import { erc20 } from '../../constants/contracts/ecr20';

function FaucetPage() {
  const [accounts, setAccount] = useState("Loading...");
  const [listInfo, setListInfo] = useState([]);


  const listTokenAddress = [
    "0x685aEF5Ce482700dF29Dd69b2931f86575CeFb40",
    "0xA39a336E89A33D24B5C8a0d594B1f2A78b255825",
    "0x4BFd1d96ce80D728F472cd397451025EF6b4Bb0b",
    "0x56beBA0D627472b521CCd3171084C6a35B68851f",
    "0x10A4a23dCd680b29d27CD58438Ef0E81cd147C86",
    "0x5eBB49CF36de3967358Ed1D51B14BfF4854bF5eD",
    "0x660FB72163Aeaa05B1F1ad530D8bE6aceb8d7431"
  ]

  async function getInfoToken(addressToken) {
    let web3 = await getWeb3();
    let accounts = await web3.eth.getAccounts();
    let contract = await erc20(addressToken);
    let balance = await contract.methods.balanceOf(accounts[0]).call()
    let decimals = await contract.methods.decimals().call()
    let symbol = await contract.methods.symbol().call()
    return { "symbol": symbol, "decimals": decimals, "balance": balance, "address": addressToken }
  }
  useEffect(() => {
    async function fetWeb3Init() {
      let web3 = await getWeb3();
      let accounts = await web3.eth.getAccounts();
      let listToken_ = []
      await Promise.all(listTokenAddress.map(async (address) => {
        let { symbol, decimals, balance } = await getInfoToken(address)
        await listToken_.push({
          "symbol": symbol,
          "decimals": decimals,
          "balance": balance,
          "address": address
        })
      }))
      await setAccount(accounts[0]);
      await setListInfo(listToken_);
    }
    fetWeb3Init();
  }, []);
  return (
    <div>
      <h3>{accounts}</h3>
      <div className="MainContent">
        {
          listInfo.map(({ address, symbol, decimals, balance }) => {
            return (<button key={address} className='buttonFaucet' onClick={async () => {
              let contractToken = await erc20(address);
              let data = await contractToken.methods.mint(Web3.utils.toBN(BigInt(1000 * 10 ** decimals).toString())).send({ from: accounts })
              alert("Add Liquidity Success Check on   https://mumbai.polygonscan.com/tx/" + data.transactionHash)
            }}> You balance {(balance / 10 ** decimals).toFixed(0)} -  Faucet 1000 {symbol}</button>)
          })
        }

      </div>
    </div >
  );
}

export default FaucetPage;
