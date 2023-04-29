'use client'
import { ethers } from "ethers";
import { deployContract } from "@/web3/main/createContracts"
import React from "react"
import styles from './Governor.module.scss'


import { delegate, mint, token } from "@/app/methods/Timelock_Governor";
import { getWeb3Context } from "@/app/context/Web3Context";


export const Governor = () => {
    const [proposalJsx, setProposalJsx] = React.useState<string | JSX.Element>('Governor');
    const [proposal, setProposal] = React.useState<ethers.Contract | null>(null);

    const {provider,signer, accounts, account} = getWeb3Context();
    const MINDELAY = 100;



    const handleCreateGovernor = () => {
     
        const deployGovernor = async () => {
           // e.preventDefault();
            const [owner, deployer] = await provider.listAccounts();

            const token = await deployContract("Governor_Token", signer);
            const timelock = await deployContract("TimelockController", signer, MINDELAY,[owner], [owner], owner);
            const gov = await deployContract("Timelock_Governor", signer, token.address, timelock.address);
            localStorage.setItem(await gov.signer.getAddress(), gov.address)
        }


        setProposalJsx(<form onSubmit={deployGovernor} className={styles.login}>
            <div className={styles.inputContainer}>
                <fieldset>
                    <legend>Timelock arguments</legend>
                    <p>
                        <label>Min delay</label>
                        <input type="timelock" name="timelock"  />
                    </p>
                    <p>
                        <label>Proposers</label>
                        <input type="timelock" name="timelock"  />
                    </p>
                    <p>
                        <label>Executors</label>
                        <input type="timelock" name="timelock"  />
                    </p>
                    <p>
                        <label>Admin</label>
                        <input type="timelock" name="timelock"  />
                    </p>
                </fieldset>

            </div>
            <div className={styles.buttonContainer} onClick={() => deployGovernor()}>
               deploy
            </div>
        </form>)
        // deployContract('')
    }



const voter1 = '0x90F79bf6EB2c4f870365E785982E1f101E93b906'

    const handleDelegate = async() => {
    
        delegate(await token('',signer),signer, voter1, 10)
    }

    return (
        <>
        <li onClick={() => handleCreateGovernor()}>
            {proposalJsx}
        </li>
        <li onClick={handleDelegate}>
            delegate
        </li>
        <li onClick={async()=>mint(await token('',signer),account,100)}>
            mint
        </li>
        </>
    )
}