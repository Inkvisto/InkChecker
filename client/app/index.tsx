'use client';

import React from "react"
import { ethers } from 'ethers'
import { ConnectWalletComponent} from "./components/ConnectWalletComponent";
import {signTypedData, SignTypedDataVersion} from "@metamask/eth-sig-util";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { fromRpcSig } from 'ethereumjs-util'
import { createProposal } from "./methods";
import { getBalance } from "@/web3/main/getBalance";
import { initGovernance } from "@/web3/main/Governor";
import Header from "./components/Header";
import { connectWallet } from "@/web3/connectors/connectWallet";
import styles from './Main.module.scss'
import { Governor } from "./components/Governor";
import { GovernorInteraction } from "./components/Governor/interaction";



export const Main = () => {

   


    return (
        <div>
            Select type of token to create
          <ul className={styles.list}>
           <Governor />
          </ul>
        </div>
    );
}