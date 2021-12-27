import { getWeb3 } from '../web3/getWeb3';
import PancakeFactory_ABI from '../abi/PancakeFactory.json'
const PancakeFactory = async (addressContract) => {
    let web3 = await getWeb3();
    return new web3.eth.Contract(PancakeFactory_ABI, addressContract)
};
export { PancakeFactory };