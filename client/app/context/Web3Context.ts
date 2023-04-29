'use client'

import React from 'react';
import type { BaseProvider, Web3Provider } from '@ethersproject/providers'

import { ethers } from "ethers";
import { JsonRpcProvider, StaticJsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { Address } from 'ethereumjs-util';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';



  
export const Web3Context = React.createContext<Web3ContextType | undefined>(undefined);




  export const getWeb3Context = () => {
    const context = React.useContext(Web3Context);
    if (!context) throw Error('useWeb3React can only be used within the Web3ReactProvider component');
    return context;
  };


  export type Web3ContextType = {
    chainId: number,
    accounts: SignerWithAddress[],
    account: string,
    provider: ethers.providers.Web3Provider,
    signer:any,
    connectionError:any
  };


  