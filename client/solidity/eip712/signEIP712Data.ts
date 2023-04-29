import {ethers} from 'hardhat';
import { MAX_UINT256, nonce } from './utils/constants';


export const eip712 = async (signer: any,provider:any, votes: any, chainId: number): Promise<[any, string]> => {

    const domain = {
        name: 'Governor_Votes',
        version: '1',
        chainId: 31337,
        verifyingContract: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
    };

    const types = {
        Delegation: [
            { name: 'delegatee', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'expiry', type: 'uint256' },
        ]
    };

    const mail = {
        delegatee: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        nonce: nonce,
        expiry: MAX_UINT256
    };

    const delegator = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

    const signature = await delegator._signTypedData(domain, types, mail);

    return [delegator, signature];
}