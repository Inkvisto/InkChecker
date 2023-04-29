import { ethers } from "hardhat";
import { toEnum } from "./typeConverters";


export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const MAX_UINT256 = ethers.BigNumber.from('2').pow(ethers.BigNumber.from('256')).sub(ethers.BigNumber.from('1'));
export const nonce = 0;

export const ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';

export const random_salt = '0x025e7b0be353a74631ad648c667493c0e1cd31caa4cc2d3520fdc171ea0cc726';

export const MINDELAY = 100;


// governor

export const VoteType = toEnum('Against', 'For', 'Abstain')
export const ProposalState = toEnum('Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed');
export const tokenSupply = 100;
export const votingDelay = 4;
export const votingPeriod = 300;



// timelock
export const TIMELOCK_ADMIN_ROLE = ethers.utils.solidityKeccak256(['string'], ['TIMELOCK_ADMIN_ROLE']);
export const PROPOSER_ROLE = ethers.utils.solidityKeccak256(['string'], ['PROPOSER_ROLE']);
export const EXECUTOR_ROLE = ethers.utils.solidityKeccak256(['string'], ['EXECUTOR_ROLE']);
export const CANCELLER_ROLE = ethers.utils.solidityKeccak256(['string'], ['CANCELLER_ROLE']);