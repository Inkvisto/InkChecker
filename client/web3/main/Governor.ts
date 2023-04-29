import { deployContract, getWeb3Context } from "./createContracts";







export const initGovernance = async () => {
    const { account, chainId, signer } = getWeb3Context();


    const token = await deployContract('Governor_Token', chainId, signer);
    return token;
    
   /* const timelock = await deployContract('TimelockController',chainId, signer,[100, [], [], account.address]);
    const governor = deployContract('Timelock_Governor',chainId, signer,[token.address,timelock.address]);*/

}

