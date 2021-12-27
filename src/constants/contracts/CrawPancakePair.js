import { getWeb3 } from '../web3/getWeb3';
import CrawPancakePair_ABI from '../abi/CrawPancakePair.json'
const CrawPancakePair = async (addressContract) => {
    let web3 = await getWeb3();
    return new web3.eth.Contract(CrawPancakePair_ABI, addressContract)
};
export { CrawPancakePair };