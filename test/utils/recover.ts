import { ethers } from "hardhat";

async function recover(tx:any): Promise<{
    publicKey: string;
    address: string;
  }> {
    const expandedSig = {
      r: tx.r!,
      s: tx.s!,
      v: tx.v!,
    };
  
    const signature = ethers.utils.joinSignature(expandedSig);
  
    const txData = {
      gasLimit: tx.gasLimit,
      value: tx.value,
      nonce: tx.nonce,
      data: tx.data,
      chainId: tx.chainId,
      to: tx.to, // you might need to include this if it's a regular tx and not simply a contract deployment
      type: tx.type,
      maxFeePerGas: tx.maxFeePerGas,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas,
    };
  
    const rsTx = await ethers.utils.resolveProperties(txData);
    const raw = ethers.utils.serializeTransaction(rsTx); // returns RLP encoded tx
  
    const msgHash = ethers.utils.keccak256(raw); // as specified by ECDSA
    const msgBytes = ethers.utils.arrayify(msgHash); // create binary hash
  
    return {
      publicKey: ethers.utils.recoverPublicKey(msgBytes, signature),
      address: ethers.utils.recoverAddress(msgBytes, signature),
    };

}
  
  