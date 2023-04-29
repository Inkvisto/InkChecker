import { Address } from 'ethereumjs-util';
import ethers from 'ethers';
import { getWeb3Context } from './createContracts';




export const getBalance = async (addresses: Address | Address[] | any) => {
    const { provider } = getWeb3Context();
    if (Array.isArray(addresses)) {
        addresses.forEach(async (address: string) => {
            const balance = await provider?.getBalance(address);
        })
    } else {
        return await provider?.getBalance(addresses);
    }
}
