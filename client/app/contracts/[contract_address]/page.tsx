import { Contract } from "./Contract";
import { access, readFile, constants, readdir } from "fs/promises";
import {dirname, resolve} from "path";

export default async function Page({searchParams}:any) {

    const solContractsDir = resolve('../contracts');
   const hh_contracts = await readdir(solContractsDir);


   
    try {
        const contents = await readFile(solContractsDir+'/Ink_Governor.sol', { encoding: 'utf8' });
      
      } catch (err:any) {
        console.error(err.message);
      }

    return (
        <div style={{ height: '100%',
   margin:0}}>
            <Contract name={searchParams.contractName} />
        </div>
    )
}