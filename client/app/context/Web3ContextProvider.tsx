'use client'

import React from "react";

import { connectWallet } from "@/web3/connectors/connectWallet";
import { Web3Context } from "./Web3Context";


export const Web3ContextProvider = ({ children, componentType }: Partial<{
    children: React.ReactNode,
    componentType:string
}>) => {

    const [contextData, setContextData]: any = React.useState({ accounts: [] });


    React.useEffect(() => {
        (async () => {
            try {
                const connector = await connectWallet();

                setContextData({
                    connector,
                    accounts: await connector.listAccounts(),
                    signer: connector.getSigner(),
                    chainId: (await connector.getNetwork()).chainId
                })
            } catch (e) {
                setContextData({
                    accounts: [],
                    connectionError: e
                })
            }
        })()
    }, [])


    const { connector, accounts, signer, chainId, connectionError } = contextData;
    if(componentType === 'server') return contextData;

    return (
        <Web3Context.Provider
            value={{
                chainId,
                account: accounts[0],
                accounts,
                provider: connector,
                signer,
                connectionError
            }}
        >
            {children}
        </Web3Context.Provider>
    )
};

