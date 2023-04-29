'use client'
import React from "react";
import { NetworkErrorMessage } from "../NetworkErrorMessage";
import { connectWallet } from "@/web3/connectors/connectWallet";
import Header from "./Header";


export const ConnectWalletComponent = ({ children }: any) => {
  const [networkError, setNetworkError] = React.useState<null | string>(null);
  const [connected, setConnected] = React.useState(false);

  const handleClick = async () => {
     await connectWallet();
    if (networkError) setNetworkError(networkError);
  }

  React.useEffect(() => {
    (async () => {
      await connectWallet();
      if (connected) setConnected(true);
    })()
  }, [])

  return (
    <>
      {!connected ? <>
        <div>
          {networkError && (
            <NetworkErrorMessage
              message={networkError}
            />
          )}
        </div>

        <p>Connecting to wallet...</p>
      </> : <></>}
      <div>
        {networkError ? <button type="button" onClick={async () => await handleClick()}>
          Connect Wallet
        </button> : null}
      </div>
    </>
  )
}