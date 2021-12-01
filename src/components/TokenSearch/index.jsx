import './styles.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { getWeb3 } from '../../constants/web3/getWeb3';
import { erc20 } from '../../constants/contracts/ecr20';

function TokenSearch(props) {
    const initListAddress = [
        "0x25FE88F3a2F152d5A710B51171e09c10FcbF1403",
        "0xae39290ffbda6C5847F647f92cBf37FdA4C2de80",
        "0x30D9dced0FFB0e669F08427BEda558634129Ee2d",
        "0x23DD4011caf6116A210f9AF9a7E09224C80024F7",
        "0x5854C10B16371C73f95EA7011876A6E1C0b08467",
        "0x5D3adF141E075319F20D59F15c4959813e5E6814",
        "0xe4650ae6F9984958C36E4891d49Be741dC399d1b"
    ]
    const [listAddress, setListAddress] = useState(initListAddress)
    const [listInfo, setListInfo] = useState([])
    function handedClickCLose() {
        if (props.handedClickCLose) {
            props.handedClickCLose();
        }
    }
    function handedClickCard(address) {
        if (props.handedClickCard) {
            props.handedClickCard(address);
        }
    }
    async function getInfoToken(addressToken) {
        let web3 = await getWeb3();
        let accounts = await web3.eth.getAccounts();
        let contract = await erc20(addressToken);
        let balance = await contract.methods.balanceOf(accounts[0]).call()
        let decimals = await contract.methods.decimals().call()
        let symbol = await contract.methods.symbol().call()
        balance = (balance / 10 ** decimals).toFixed(3)
        return { "symbol": symbol, "decimals": decimals, "balance": balance, "address": addressToken }

    }
    useEffect(() => {
        async function getInfoList() {
            let listInfo_ = []
            await Promise.all(listAddress.map(async (address) => {
                try {
                    let { symbol, decimals, balance } = await getInfoToken(address);
                    await listInfo_.push({ symbol, decimals, balance, address })
                } catch (error) {
                    console.log("Cant find token")
                }

            }))
            await setListInfo(listInfo_)
        }
        getInfoList()
    }, [listAddress])
    return (
        <div className="PanelTokenSearch">
            <div className="MainCardTokenSearch">
                <div className="MainCardTokenSearchTitle">
                    <nav>Select a token</nav>
                    <FontAwesomeIcon size="2x" icon={faTimesCircle} onClick={handedClickCLose} />
                </div>
                <input type="text" className="TokenSearchInput" placeholder="Add address to find token" onChange={async (even) => {
                    let addressToken = even.target.value;
                    if (addressToken.length > 35) {
                        setListAddress([addressToken]);
                    } else if (addressToken.length == 0) {
                        setListAddress(initListAddress);
                    }
                }} />
                <h3>Take a token</h3>
                <div className="CardTokenPanel">
                    <div>
                        {
                            listInfo.map(({ symbol, balance, address }) => {
                                // console.log({ symbol, balance, address });
                                return (
                                    <div className="CardToken" key={address} >
                                        <nav className="CardToken-Symbol" onClick={() => { handedClickCard(address); handedClickCLose() }} > {symbol}</nav>
                                        <button className="CardToken-Remove"> Remove</button>
                                        <nav className="CardToken-Token">{balance} Token</nav>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TokenSearch;
