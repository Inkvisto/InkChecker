import { Web3ContextProvider } from "@/app/context/Web3ContextProvider";
import { deployContract } from "@/web3/main/createContracts";

const MINDELAY = 100;

export const GovernorInteraction = (props:any) => {
  //  const {provider,signer, accounts, account}  = Web3ContextProvider({componentType:'server'});


    const deployGovernor = async () => {
        await deployContract("Governor_Token",null)
        // e.preventDefault();
        /*
        const [owner, deployer] = await provider.listAccounts();

         const token = await deployContract("Governor_Token", signer);
         const timelock = await deployContract("TimelockController", signer, MINDELAY,[owner], [owner], owner);
         const gov = await deployContract("Timelock_Governor", signer, token.address, timelock.address);*/
         //localStorage.setItem(await gov.signer.getAddress(), gov.address)
     }
    
    return(<></>)
}