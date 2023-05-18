"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eip712 = void 0;
const hardhat_1 = require("hardhat");
const constants_1 = require("./constants");
const eip712 = async (signer, contract, chainId, type, opts) => {
    const domain = {
        name: await contract.name(),
        version: '1',
        chainId: chainId,
        verifyingContract: contract.address
    };
    const delegationTypes = {
        Delegation: [
            { name: 'delegatee', type: 'address' },
            { name: 'nonce', type: 'uint256' },
            { name: 'expiry', type: 'uint256' },
        ]
    };
    const ballotTypes = {
        Ballot: [
            { name: 'proposalId', type: 'uint256' },
            { name: 'support', type: 'uint8' },
        ]
    };
    const delegationData = {
        delegatee: signer.address,
        nonce: constants_1.nonce,
        expiry: constants_1.MAX_UINT256
    };
    const delegator = new hardhat_1.ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', signer.provider);
    let signature;
    if (type === 'Ballot') {
        if (opts !== null) {
            const { proposalId, support, reason, params } = opts;
            const ballotData = {
                proposalId: proposalId,
                support: support,
            };
            signature = await delegator._signTypedData(domain, ballotTypes, ballotData);
        }
        else {
            throw new Error('No oopts for eip712 provided');
        }
    }
    else {
        signature = await delegator._signTypedData(domain, delegationTypes, delegationData);
    }
    return [delegator, signature];
};
exports.eip712 = eip712;
