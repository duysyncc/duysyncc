import './styles.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { getWeb3 } from '../../constants/web3/getWeb3';
import { erc20 } from '../../constants/contracts/ecr20';

function TokenSearch(props) {
    const initListAddress = [
        "0x685aEF5Ce482700dF29Dd69b2931f86575CeFb40",
        "0xA39a336E89A33D24B5C8a0d594B1f2A78b255825",
        "0x4BFd1d96ce80D728F472cd397451025EF6b4Bb0b",
        "0x56beBA0D627472b521CCd3171084C6a35B68851f",
        "0x10A4a23dCd680b29d27CD58438Ef0E81cd147C86",
        "0x5eBB49CF36de3967358Ed1D51B14BfF4854bF5eD",
        "0x660FB72163Aeaa05B1F1ad530D8bE6aceb8d7431"
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
