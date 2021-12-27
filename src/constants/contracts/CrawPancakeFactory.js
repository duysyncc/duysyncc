import { getWeb3 } from '../web3/getWeb3';
import CrawPancakeFactory_ABI from '../abi/CrawPancakeFactory.json'
const CrawPancakeFactory = async (addressContract) => {
    let web3 = await getWeb3();
    return new web3.eth.Contract(CrawPancakeFactory_ABI, addressContract)
};
export { CrawPancakeFactory };