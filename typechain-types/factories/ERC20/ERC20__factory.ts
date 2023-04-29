/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { ERC20, ERC20Interface } from "../../ERC20/ERC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162000be338038062000be3833981016040819052620000349162000129565b6000805460ff1916905560046200004c838262000222565b5060056200005b828262000222565b505050620002ee565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200008c57600080fd5b81516001600160401b0380821115620000a957620000a962000064565b604051601f8301601f19908116603f01168101908282118183101715620000d457620000d462000064565b81604052838152602092508683858801011115620000f157600080fd5b600091505b83821015620001155785820183015181830184015290820190620000f6565b600093810190920192909252949350505050565b600080604083850312156200013d57600080fd5b82516001600160401b03808211156200015557600080fd5b62000163868387016200007a565b935060208501519150808211156200017a57600080fd5b5062000189858286016200007a565b9150509250929050565b600181811c90821680620001a857607f821691505b602082108103620001c957634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156200021d57600081815260208120601f850160051c81016020861015620001f85750805b601f850160051c820191505b81811015620002195782815560010162000204565b5050505b505050565b81516001600160401b038111156200023e576200023e62000064565b62000256816200024f845462000193565b84620001cf565b602080601f8311600181146200028e5760008415620002755750858301515b600019600386901b1c1916600185901b17855562000219565b600085815260208120601f198616915b82811015620002bf578886015182559484019460019091019084016200029e565b5085821015620002de5787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6108e580620002fe6000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c80635c975abb116100715780635c975abb1461014157806370a082311461014c57806395d89b4114610175578063a457c2d71461017d578063a9059cbb14610190578063dd62ed3e146101a357600080fd5b806306fdde03146100b9578063095ea7b3146100d757806318160ddd146100fa57806323b872dd1461010c578063313ce5671461011f578063395093511461012e575b600080fd5b6100c16101b6565b6040516100ce919061072f565b60405180910390f35b6100ea6100e5366004610799565b610248565b60405190151581526020016100ce565b6003545b6040519081526020016100ce565b6100ea61011a3660046107c3565b610262565b604051601281526020016100ce565b6100ea61013c366004610799565b610286565b60005460ff166100ea565b6100fe61015a3660046107ff565b6001600160a01b031660009081526001602052604090205490565b6100c16102a8565b6100ea61018b366004610799565b6102b7565b6100ea61019e366004610799565b610337565b6100fe6101b1366004610821565b610345565b6060600480546101c590610854565b80601f01602080910402602001604051908101604052809291908181526020018280546101f190610854565b801561023e5780601f106102135761010080835404028352916020019161023e565b820191906000526020600020905b81548152906001019060200180831161022157829003601f168201915b5050505050905090565b600033610256818585610370565b60019150505b92915050565b600033610270858285610494565b61027b85858561050e565b506001949350505050565b6000336102568185856102998383610345565b6102a3919061088e565b610370565b6060600580546101c590610854565b600033816102c58286610345565b90508381101561032a5760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b61027b8286868403610370565b60003361025681858561050e565b6001600160a01b03918216600090815260026020908152604080832093909416825291909152205490565b6001600160a01b0383166103d25760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b6064820152608401610321565b6001600160a01b0382166104335760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b6064820152608401610321565b6001600160a01b0383811660008181526002602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925910160405180910390a3505050565b60006104a08484610345565b9050600019811461050857818110156104fb5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e63650000006044820152606401610321565b6105088484848403610370565b50505050565b6001600160a01b0383166105725760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b6064820152608401610321565b6001600160a01b0382166105d45760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b6064820152608401610321565b6105df8383836106c4565b6001600160a01b038316600090815260016020526040902054818110156106575760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b6064820152608401610321565b6001600160a01b0380851660008181526001602052604080822086860390559286168082529083902080548601905591517fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef906106b79086815260200190565b60405180910390a3610508565b60005460ff161561072a5760405162461bcd60e51b815260206004820152602a60248201527f45524332305061757361626c653a20746f6b656e207472616e736665722077686044820152691a5b19481c185d5cd95960b21b6064820152608401610321565b505050565b600060208083528351808285015260005b8181101561075c57858101830151858201604001528201610740565b506000604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b038116811461079457600080fd5b919050565b600080604083850312156107ac57600080fd5b6107b58361077d565b946020939093013593505050565b6000806000606084860312156107d857600080fd5b6107e18461077d565b92506107ef6020850161077d565b9150604084013590509250925092565b60006020828403121561081157600080fd5b61081a8261077d565b9392505050565b6000806040838503121561083457600080fd5b61083d8361077d565b915061084b6020840161077d565b90509250929050565b600181811c9082168061086857607f821691505b60208210810361088857634e487b7160e01b600052602260045260246000fd5b50919050565b8082018082111561025c57634e487b7160e01b600052601160045260246000fdfea26469706673582212208e3f49254514294af8646ade179aba0dcb5a4c04053c4f334966b0b59467cf3d64736f6c63430008110033";

type ERC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC20__factory extends ContractFactory {
  constructor(...args: ERC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC20> {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<ERC20>;
  }
  override getDeployTransaction(
    name_: PromiseOrValue<string>,
    symbol_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  override attach(address: string): ERC20 {
    return super.attach(address) as ERC20;
  }
  override connect(signer: Signer): ERC20__factory {
    return super.connect(signer) as ERC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC20Interface {
    return new utils.Interface(_abi) as ERC20Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC20 {
    return new Contract(address, _abi, signerOrProvider) as ERC20;
  }
}
