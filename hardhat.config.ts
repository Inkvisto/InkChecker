import { HardhatUserConfig, subtask } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "hardhat-deploy";
import "hardhat-contract-sizer";
import "hardhat-forta";
import "hardhat-gas-reporter"


import {TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS} from 'hardhat/builtin-tasks/task-names'
import { getJsonRpcUrl } from "forta-agent";
/*
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS)
  .setAction(async (_, __, runSuper) => {
    const paths = await runSuper();

    return paths.filter((p:any) => {console.log(p)});
  });
*/

const config: HardhatUserConfig = {
  solidity: {
    version:"0.8.17",
    settings:{
      optimizer:{
        enabled: true
      }
     },
  },
  etherscan:{
    apiKey:'RSQ5H3Q1IN2K8CZMACJSK8AU9PR1F35HF8',
  },
  
  networks:{
    homestead: {
      url:'https://etherscan.io',
      gasPrice: 20e8,
      gas: 25e6,
    },
    hardhat:{
      forking:{
        url: getJsonRpcUrl()
      }
    }
  },
  gasReporter: {
    enabled:false,
    coinmarketcap:'313f8a67-62dd-4bf1-86e6-431538f803a9'
  },

  namedAccounts: {
    deployer: {
      default: 0, 
      1: 0, 
    },
    proposer:{
      default:1,
      1:1
    },
    executor: {
      default:2,
      0:2
    }
  }
  
};

export default config;
