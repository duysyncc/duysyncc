import { getWeb3 } from '../web3/getWeb3';
import Stake_ABI from '../abi/Stake.json'
const Stake = async (addressContract) => {
    let web3 = await getWeb3();
    return new web3.eth.Contract(Stake_ABI, addressContract)
};
export { Stake };