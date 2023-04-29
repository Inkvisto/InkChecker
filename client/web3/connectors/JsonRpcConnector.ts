import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";

export const JsonRpcConnector = async (url: string = 'http://127.0.0.1:8545/', opts: any = { currentChainId: 31337, staticProvider: true }): Promise<JsonRpcProvider> => {
    try {

        let provider: JsonRpcProvider | StaticJsonRpcProvider;

        if (opts.staticProvider) {
            provider = new StaticJsonRpcProvider(url);
        } else {
            provider = new JsonRpcProvider(url);
        }


        if (!provider?.anyNetwork) {
            console.warn(`ConnectToStaticJsonRpcProvider: could not connect to chain: ${opts.currentChainId} url: ${url}`);
        }

        return provider;


    } catch (e) {
        throw new Error('EthersModalConnector: NoJsonRpcProviderFound - Could not find a json-rpc provider.  Is it running?')
    }


}