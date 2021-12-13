import './styles.css';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { getWeb3 } from '../../constants/web3/getWeb3';
import { erc20 } from '../../constants/contracts/ecr20';
import { Stake } from '../../constants/contracts/Stake';

function StakePage() {
  const [accounts, setAccount] = useState("Loading...");
  const [balanceTx8, setBalanceTx8] = useState(0);
  const [dateStake, setDateStake] = useState(10);
  const [numTokenStake, setNumTokenStake] = useState(0);
  const [profit, setProfit] = useState(0)
  const [infoStake, setInfoStake] = useState({})
  const tx8Address = "0xA39a336E89A33D24B5C8a0d594B1f2A78b255825";
  const stakeAddress = "0x9c071de4502DB22a76A464d7c0a29fF23c5d0153";


  async function getInfoToken(addressToken) {
    let web3 = await getWeb3();
    let accounts = await web3.eth.getAccounts();
    let contract = await erc20(addressToken);
    let balance = await contract.methods.balanceOf(accounts[0]).call()
    let decimals = await contract.methods.decimals().call()
    let symbol = await contract.methods.symbol().call()
    return { "symbol": symbol, "decimals": decimals, "balance": balance, "address": addressToken }
  }
  async function calculateReward(amount, day) {
    let contract = await Stake(stakeAddress);
    return await contract.methods.calculateReward(amount, day).call()
  }
  async function setInfoStakeInit(address) {
    let contract = await Stake(stakeAddress);
    let info = await contract.methods.stakes(address).call()
    await setInfoStake({
      initial: info.initial,
      payday: info.payday,
      reward: info.reward,
      startday: info.startday
    })
  }

  useEffect(() => {
    async function fetWeb3Init() {
      let web3 = await getWeb3();
      let accounts = await web3.eth.getAccounts();
      await setAccount(accounts[0]);
      await setInfoStakeInit(accounts[0]);
      let { balance } = await getInfoToken(tx8Address);
      setBalanceTx8(balance);

    }
    fetWeb3Init();
  }, []);


  return (
    <div>
      <h3>Address you account: {accounts}</h3>
      <h3>Address TX8 token: {tx8Address}</h3>

      <div className="MainContent">
        <div className="MainCard">
          <h2 className="BalanceHead">Your TX8 balance : {(balanceTx8 / 10 ** 18).toFixed(0)} </h2>
          <div className="SavingInfo">

            <h2>TX8 saving information</h2>
            <h4>1) Saving:	{(infoStake.initial / 10 ** 18).toFixed(3)} TX8</h4>
            <h4>2) Reward:	{(infoStake.reward / 10 ** 18).toFixed(3)} TX8</h4>
            <h4>3) Start day:	{infoStake.startday || NaN}</h4>
            <h4>3) Pay day:	{infoStake.payday || NaN}</h4>
          </div>
          <div className="SavingAmount">
            <input type="number" placeholder='Input you number token' value={(numTokenStake / 10 ** 18).toFixed(0)}
              onChange={async (even) => {
                let inputToken = even.target.value * 10 ** 18;
                setNumTokenStake(inputToken);
                let numReward = await calculateReward(Web3.utils.toBN(BigInt(inputToken).toString()), dateStake);
                setProfit(numReward)
              }} />
            <button onClick={async () => {
              setNumTokenStake(balanceTx8);
              let numReward = await calculateReward(Web3.utils.toBN(BigInt(balanceTx8).toString()), dateStake);
              setProfit(numReward)
            }}

            >MAX</button>
          </div>
          <div className="SavingAmount">
            <input type="number" placeholder='Input you day to stake token' value={dateStake}
              onChange={async (even) => {
                setDateStake(even.target.value);
                let numReward = await calculateReward(Web3.utils.toBN(BigInt(numTokenStake).toString()), dateStake);
                setProfit(numReward)
              }}
            />
            <button onClick={async () => {
              setDateStake(356);
              let numReward = await calculateReward(Web3.utils.toBN(BigInt(numTokenStake).toString()), 365);
              setProfit(numReward)
            }}>365</button>
          </div>
          <h3>Profit : {(profit / 10 ** 18).toFixed(3)} TX8 after {dateStake} day</h3>
          <button id='Confirm' onClick={async () => {
            let contractTx8 = await erc20(tx8Address);
            let allowanceTx8 = await contractTx8.methods.allowance(accounts, stakeAddress).call();
            if (+numTokenStake > +allowanceTx8) {
              alert("Approve token TX8 ")
              await contractTx8.methods.approve(stakeAddress, Web3.utils.toBN(BigInt(10 ** 50).toString())).send({ from: accounts })
            }

            alert("Stake now")
            try {
              let contract = await Stake(stakeAddress);
              var data = await contract.methods.stake(
                Web3.utils.toBN(BigInt(numTokenStake).toString()),
                dateStake,
              ).send({ from: accounts })
              await setInfoStakeInit(accounts);
              alert("Stake Success!, Check on https://mumbai.polygonscan.com/tx/" + data.transactionHash)
            } catch (error) {
              console.log("Error")
            }

          }}>Confirm</button>
        </div>
      </div>
    </div >
  );
}

export default StakePage;
