import { getWeb3 } from '../web3/getWeb3';
import PancakeRouter_ABI from '../abi/PancakeRouter.json'
const PancakeRouter = async (addressContract) => {
    let web3 = await getWeb3();
    return new web3.eth.Contract(PancakeRouter_ABI, addressContract)
};
export { PancakeRouter };