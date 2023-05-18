"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CANCELLER_ROLE = exports.EXECUTOR_ROLE = exports.PROPOSER_ROLE = exports.TIMELOCK_ADMIN_ROLE = exports.votingPeriod = exports.votingDelay = exports.tokenSupply = exports.ProposalState = exports.VoteType = exports.MINDELAY = exports.random_salt = exports.ZERO_BYTES32 = exports.nonce = exports.MAX_UINT256 = exports.ZERO_ADDRESS = void 0;
const hardhat_1 = require("hardhat");
const typeConverters_1 = require("./typeConverters");
exports.ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.MAX_UINT256 = hardhat_1.ethers.BigNumber.from('2').pow(hardhat_1.ethers.BigNumber.from('256')).sub(hardhat_1.ethers.BigNumber.from('1'));
exports.nonce = 0;
exports.ZERO_BYTES32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
exports.random_salt = '0x025e7b0be353a74631ad648c667493c0e1cd31caa4cc2d3520fdc171ea0cc726';
exports.MINDELAY = 100;
// governor
exports.VoteType = (0, typeConverters_1.toEnum)('Against', 'For', 'Abstain');
exports.ProposalState = (0, typeConverters_1.toEnum)('Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed');
exports.tokenSupply = 100;
exports.votingDelay = 4;
exports.votingPeriod = 300;
// timelock
exports.TIMELOCK_ADMIN_ROLE = hardhat_1.ethers.utils.solidityKeccak256(['string'], ['TIMELOCK_ADMIN_ROLE']);
exports.PROPOSER_ROLE = hardhat_1.ethers.utils.solidityKeccak256(['string'], ['PROPOSER_ROLE']);
exports.EXECUTOR_ROLE = hardhat_1.ethers.utils.solidityKeccak256(['string'], ['EXECUTOR_ROLE']);
exports.CANCELLER_ROLE = hardhat_1.ethers.utils.solidityKeccak256(['string'], ['CANCELLER_ROLE']);
