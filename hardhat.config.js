"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-solhint");
require("hardhat-deploy");
require("hardhat-contract-sizer");
require("hardhat-forta");
require("hardhat-gas-reporter");
const forta_agent_1 = require("forta-agent");
/*
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS)
  .setAction(async (_, __, runSuper) => {
    const paths = await runSuper();

    return paths.filter((p:any) => {console.log(p)});
  });
*/
const config = {
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true
            }
        },
    },
    etherscan: {
        apiKey: 'RSQ5H3Q1IN2K8CZMACJSK8AU9PR1F35HF8',
    },
    networks: {
        homestead: {
            url: 'https://etherscan.io',
            gasPrice: 20e8,
            gas: 25e6,
        },
        hardhat: {
            forking: {
                url: (0, forta_agent_1.getJsonRpcUrl)()
            }
        }
    },
    gasReporter: {
        enabled: false,
        coinmarketcap: '313f8a67-62dd-4bf1-86e6-431538f803a9'
    },
    namedAccounts: {
        deployer: {
            default: 0,
            1: 0,
        },
        proposer: {
            default: 1,
            1: 1
        },
        executor: {
            default: 2,
            0: 2
        }
    }
};
exports.default = config;
