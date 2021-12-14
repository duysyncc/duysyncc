import { getWeb3 } from '../web3/getWeb3';
import Tx8Swap_ABI from '../abi/Tx8Swap.json'
const Tx8Swap = async (addressContract) => {
    let web3 = await getWeb3();
    return new web3.eth.Contract(Tx8Swap_ABI, addressContract)
};
export { Tx8Swap };