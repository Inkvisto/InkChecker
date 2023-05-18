"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_1 = require("hardhat");
async function recover(tx) {
    const expandedSig = {
        r: tx.r,
        s: tx.s,
        v: tx.v,
    };
    const signature = hardhat_1.ethers.utils.joinSignature(expandedSig);
    const txData = {
        gasLimit: tx.gasLimit,
        value: tx.value,
        nonce: tx.nonce,
        data: tx.data,
        chainId: tx.chainId,
        to: tx.to,
        type: tx.type,
        maxFeePerGas: tx.maxFeePerGas,
        maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
    };
    const rsTx = await hardhat_1.ethers.utils.resolveProperties(txData);
    const raw = hardhat_1.ethers.utils.serializeTransaction(rsTx); // returns RLP encoded tx
    const msgHash = hardhat_1.ethers.utils.keccak256(raw); // as specified by ECDSA
    const msgBytes = hardhat_1.ethers.utils.arrayify(msgHash); // create binary hash
    return {
        publicKey: hardhat_1.ethers.utils.recoverPublicKey(msgBytes, signature),
        address: hardhat_1.ethers.utils.recoverAddress(msgBytes, signature),
    };
}
