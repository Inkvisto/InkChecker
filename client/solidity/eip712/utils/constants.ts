import {ethers} from 'hardhat';

export const MAX_UINT256 = ethers.BigNumber.from('2').pow(ethers.BigNumber.from('256')).sub(ethers.BigNumber.from('1'));
export const nonce = 0;