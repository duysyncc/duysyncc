import "./styles.css";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusCircle,
  faPlus,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import Web3 from "web3";
import { getWeb3 } from "../../constants/web3/getWeb3";
import { erc20 } from "../../constants/contracts/ecr20";
import { CrawPancakeFactory } from "../../constants/contracts/CrawPancakeFactory";
import { CrawPancakePair } from "../../constants/contracts/CrawPancakePair";
import { PancakeRouter } from "../../constants/contracts/PancakeRouter";
import TokenSearch from "../../components/TokenSearch";

function CrawlPage() {
  const [allPairsLengthCount, setAllPairsLengthCount] = useState(0);
  const [listInfo, setListInfo] = useState([]);

  async function fGetAllPairs(index) {
    let contract = await CrawPancakeFactory(
      "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
    );
    let pairAddress_ = await contract.methods.allPairs(index).call();
    return pairAddress_;
  }

  async function fGetAllPairsLengthCount() {
    let contract = await CrawPancakeFactory(
      "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73"
    );
    let allPairsLength_ = await contract.methods.allPairsLength().call();
    // console.log(allPairsLength_);
    return allPairsLength_;
  }
  async function getInfoPair(addressPair) {
    let contract = await CrawPancakePair(addressPair);
    let token0Address = await contract.methods.token0().call();
    let token1Address = await contract.methods.token1().call();
    let token1 = await getInfoToken(token0Address, addressPair);
    let token2 = await getInfoToken(token1Address, addressPair);
    // console.log(token1);
    // console.log(token2);
    return {
      addressPair: addressPair,
      token0Address: token1,
      token1Address: token2,
    };
  }

  async function getInfoToken(addressToken, addressBalance) {
    let contract = await erc20(addressToken);
    let name = await contract.methods.name().call();
    let symbol = await contract.methods.symbol().call();
    let balance = await contract.methods.balanceOf(addressBalance).call();
    let decimals = await contract.methods.decimals().call();
    return {
      symbol: symbol,
      name: name,
      address: addressToken,
      balance: balance,
      decimals: decimals,
    };
  }
  async function update() {
    let lengthPair = await fGetAllPairsLengthCount();
    let pairAddress = await fGetAllPairs(lengthPair - 1);
    let pairInfo = await getInfoPair(pairAddress);
    let setListInfo_ = [...listInfo, pairInfo];
    if (lengthPair != allPairsLengthCount) {
      setListInfo([...new Set(setListInfo_)]);
    }
    setAllPairsLengthCount(lengthPair);
  }
  useEffect(() => {
    const intervalId = setInterval(async () => {
      await update();
    }, 2000);
    return () => {
      clearInterval(intervalId);
    };
  }, [allPairsLengthCount]);

  return (
    <div>
      <div className="Summary">
        <h1>Tổng số cặp : {allPairsLengthCount}</h1>
        <button
          onClick={() => {
            setListInfo([]);
          }}
        >
          Clear All
        </button>
        <button
          onClick={async () => {
            let info = [];
            await listInfo.map(async (item) => {
              let pairInfo = await getInfoPair(item.addressPair);
              await info.push(pairInfo);
              console.log(info);
            });
            await setListInfo(info);
            await setAllPairsLengthCount(0);
          }}
        >
          Reload
        </button>
      </div>
      <div className="ViewPair">
        {listInfo.map((item) => {
          return (
            <div className="Card" key={item.addressPair}>
              <a
                target="_blank"
                className="PairAddress"
                href={
                  "https://pancakeswap.finance/info/pool/" + item.addressPair
                }
              >
                Pool : {item.addressPair}
              </a>
              <div className="PairOne">
                <h4>
                  {item.token0Address.name} | Balance :
                  {item.token0Address.balance /
                    10 ** item.token0Address.decimals}
                </h4>
                <a
                  target="_blank"
                  href={
                    "https://bscscan.com/address/" + item.token0Address.address
                  }
                >
                  Address : {item.token0Address.address}
                </a>
                <h5>Symbol : {item.token0Address.symbol}</h5>
              </div>
              <div className="PairTwo">
                <h4>
                  {item.token1Address.name} | Balance :
                  {item.token1Address.balance /
                    10 ** item.token1Address.decimals}
                </h4>
                <a
                  target="_blank"
                  href={
                    "https://bscscan.com/address/" + item.token1Address.address
                  }
                >
                  Address : {item.token1Address.address}
                </a>
                <h5>Symbol : {item.token1Address.symbol}</h5>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CrawlPage;
