"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Implementation2__factory = void 0;
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
const ethers_1 = require("ethers");
const _abi = [
    {
        inputs: [],
        name: "getValue",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_number",
                type: "uint256",
            },
        ],
        name: "setValue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];
const _bytecode = "0x608060405234801561001057600080fd5b50610183806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80632096525514610046578063552410771461005b5780638129fc1c14610070575b600080fd5b60015460405190815260200160405180910390f35b61006e610069366004610134565b600155565b005b61006e600054610100900460ff16806100885750303b155b80610096575060005460ff16155b6100fd5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b600054610100900460ff1615801561011f576000805461ffff19166101011790555b8015610131576000805461ff00191690555b50565b60006020828403121561014657600080fd5b503591905056fea2646970667358221220c2ad1f5827f6b04ac5c870d874c874c458f08fd46c39e56b5f56e60af30c644c64736f6c63430008110033";
const isSuperArgs = (xs) => xs.length > 1;
class Implementation2__factory extends ethers_1.ContractFactory {
    constructor(...args) {
        if (isSuperArgs(args)) {
            super(...args);
        }
        else {
            super(_abi, _bytecode, args[0]);
        }
    }
    deploy(overrides) {
        return super.deploy(overrides || {});
    }
    getDeployTransaction(overrides) {
        return super.getDeployTransaction(overrides || {});
    }
    attach(address) {
        return super.attach(address);
    }
    connect(signer) {
        return super.connect(signer);
    }
    static createInterface() {
        return new ethers_1.utils.Interface(_abi);
    }
    static connect(address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    }
}
exports.Implementation2__factory = Implementation2__factory;
Implementation2__factory.bytecode = _bytecode;
Implementation2__factory.abi = _abi;