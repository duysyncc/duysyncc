import { getWeb3 } from '../web3/getWeb3';
import ERC20_ABI from '../abi/erc20.json'
const erc20 = async (addressContract) => {
    let web3 = await getWeb3();
    return new web3.eth.Contract(ERC20_ABI, addressContract)
};
export { erc20 };