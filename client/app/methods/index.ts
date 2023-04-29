import { ethers } from "ethers";
import Governor_Token_Adress from '../../contracts/Governor_Token-contract-address.json' assert {type: "json"};
import Governor_Token_Artifact from '../../contracts/Governor_Token.json' assert {type: "json"};
import TimelockController_Artifact from '../../contracts/TimelockController.json' assert {type: "json"};
import Timelock_Governor from '../../contracts/Timelock_Governor.json' assert {type: "json"};


const MINDELAY = 100;


export const createProposal = async (provider: ethers.providers.Web3Provider, signer: ethers.Signer) => {




}





/*    const [owner, deployer] = await provider.listAccounts();
    const Token = new ethers.ContractFactory(Governor_Token_Artifact.abi,Governor_Token_Artifact.bytecode, signer)
    const token = await Token.deploy();
    await token.deployed();

    const TimeLock = new ethers.ContractFactory(TimelockController_Artifact.abi, TimelockController_Artifact.bytecode, signer);

    const timelock = await TimeLock.deploy(MINDELAY, [owner], [owner], deployer)
    await timelock.deployed();

    const Governor = new ethers.ContractFactory(Timelock_Governor.abi, Timelock_Governor.bytecode, signer);
    const gov = await Governor.deploy(token.address, timelock.address);
    await gov.deployed(); */


/*
const signData = async (provider: ethers.providers.Web3Provider,signer:any) => {
    const votes = new ethers.Contract(
        Ink_Votes_Adress.address,
        Ink_Votes_Artifact.abi,
        signer
    );



    const chainId = (await votes.provider.getNetwork()).chainId;
    const [delegator, signature] = await eip712(signer,provider, votes, chainId);
    const { v, r, s } = fromRpcSig(signature);
   // const receipt = await (await votes.delegateBySig(delegator.address, nonce, MAX_UINT256, v, r, s)).wait();


    
        
}*/