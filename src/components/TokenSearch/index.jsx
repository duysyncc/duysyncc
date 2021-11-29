import './styles.css';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

import { getWeb3 } from '../../constants/web3/getWeb3';
import { erc20 } from '../../constants/contracts/ecr20';

function TokenSearch(props) {
    const initListAddress = [
        "0xb289b361a633A9D2b0B39BAE76BB458d83f58CEC",
        "0x03351b77e3548b2fa34b89b39e10f327b298c257",
        "0x00c3476c81c6D301586F1686c3AcB30Da474535D",
        "0x63d780Ab54c8c962495DC0DbDaC60cc6f9fe8572",
        "0x246441468045B4417371886c3b4573A24B80b776",
        "0x9d07dC7E5B125c473B2Bdd100F66F240Eb2f5948",
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
