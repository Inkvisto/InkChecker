
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Address } from 'hardhat-deploy/types';
import { ERC20Votes, Governor, Governor_Token} from '../../../typechain-types';
import { getContract } from "@/web3/main/createContracts";



export const token =  async (governorAddress:string,signer:any):Promise<any> =>await getContract("Governor_Token",'0x21915b79e1d334499272521a3508061354d13ff0',signer);


export const gov = async (governorAddress:string,signer:any) => await getContract("Timelock_Governor",'0x0c03eCB91Cb50835e560a7D52190EB1a5ffba797',signer);

// timelock methods

// governor methods

export const delegate = async (token:ERC20Votes, from:SignerWithAddress,to:Address,value:number) => {
    await (await token.connect(from).delegate(to)).wait();
    await (await token.transfer(to, value)).wait();
  }

  export const mint = async (token:Governor_Token,address:Address,tokenSupply:number) =>{
    await token.mint(address, tokenSupply);
  }
   
  