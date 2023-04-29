
import { ethers } from "ethers";
import { JsonRpcProvider, StaticJsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Address } from 'hardhat-deploy/types';




export const deployContract = async (contractName: string, signer: JsonRpcSigner | null, ...args: any) => {
  const artifact = await import(`../../contracts/artifacts/${contractName}.json`);

  const contract = await new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer).deploy(...args);
  await contract.deployed();
  return contract;

}

export const createContract = async (contractName: string, address: string, signer: JsonRpcSigner) => {
  const artifact = await import(`../../contracts/deployed/${contractName}.json`);

  return new ethers.Contract(address, artifact.abi, signer);
}

export const getAddress = async (contractName: string) => {
  const { address } = await import(`../../contracts/deployed/${contractName}`);
  return address;

}

export const getContract = async (contractName: string, signer: JsonRpcSigner) => {

  const { address, abi } = await import(`../../contracts/deployed/${contractName}`);

  return new ethers.Contract(address, abi, signer);

}


export const getInterface = async(contractName:string) => {
    return await import(`../interfaces/${contractName}`)
};


