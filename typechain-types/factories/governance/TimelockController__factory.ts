/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  TimelockController,
  TimelockControllerInterface,
} from "../../governance/TimelockController";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "minDelay",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "proposers",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "executors",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "admin",
        type: "address",
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
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "CallExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "CallSalt",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "CallScheduled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "Cancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "oldDuration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newDuration",
        type: "uint256",
      },
    ],
    name: "MinDelayChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "CANCELLER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "EXECUTOR_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PROPOSER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TIMELOCK_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "executeBatch",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMinDelay",
    outputs: [
      {
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "getTimestamp",
    outputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "hashOperation",
    outputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
    ],
    name: "hashOperationBatch",
    outputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperation",
    outputs: [
      {
        internalType: "bool",
        name: "registered",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationDone",
    outputs: [
      {
        internalType: "bool",
        name: "done",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationPending",
    outputs: [
      {
        internalType: "bool",
        name: "pending",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "id",
        type: "bytes32",
      },
    ],
    name: "isOperationReady",
    outputs: [
      {
        internalType: "bool",
        name: "ready",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "target",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "schedule",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "targets",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
      {
        internalType: "bytes[]",
        name: "payloads",
        type: "bytes[]",
      },
      {
        internalType: "bytes32",
        name: "predecessor",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "delay",
        type: "uint256",
      },
    ],
    name: "scheduleBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    inputs: [
      {
        internalType: "uint256",
        name: "newDelay",
        type: "uint256",
      },
    ],
    name: "updateDelay",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200200938038062002009833981016040819052620000349162000408565b6200004f60008051602062001f89833981519152806200022d565b6200007960008051602062001fa983398151915260008051602062001f898339815191526200022d565b620000a360008051602062001fc983398151915260008051602062001f898339815191526200022d565b620000cd60008051602062001fe983398151915260008051602062001f898339815191526200022d565b620000e860008051602062001f898339815191523062000278565b6001600160a01b0381161562000113576200011360008051602062001f898339815191528262000278565b60005b835181101562000199576200015d60008051602062001fa98339815191528583815181106200014957620001496200048f565b60200260200101516200027860201b60201c565b6200018660008051602062001fe98339815191528583815181106200014957620001496200048f565b6200019181620004a5565b905062000116565b5060005b8251811015620001e357620001d060008051602062001fc98339815191528483815181106200014957620001496200048f565b620001db81620004a5565b90506200019d565b5060028490556040805160008152602081018690527f11c24f4ead16507c69ac467fbd5e4eed5fb5c699626d2cc6d66421df253886d5910160405180910390a150505050620004cd565b600082815260208190526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b62000284828262000288565b5050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1662000284576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620002e43390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b634e487b7160e01b600052604160045260246000fd5b80516001600160a01b03811681146200035657600080fd5b919050565b600082601f8301126200036d57600080fd5b815160206001600160401b03808311156200038c576200038c62000328565b8260051b604051601f19603f83011681018181108482111715620003b457620003b462000328565b604052938452858101830193838101925087851115620003d357600080fd5b83870191505b84821015620003fd57620003ed826200033e565b83529183019190830190620003d9565b979650505050505050565b600080600080608085870312156200041f57600080fd5b845160208601519094506001600160401b03808211156200043f57600080fd5b6200044d888389016200035b565b945060408701519150808211156200046457600080fd5b5062000473878288016200035b565b92505062000484606086016200033e565b905092959194509250565b634e487b7160e01b600052603260045260246000fd5b600060018201620004c657634e487b7160e01b600052601160045260246000fd5b5060010190565b611aac80620004dd6000396000f3fe60806040526004361061016a5760003560e01c806364d62353116100d1578063b08e51c01161008a578063d45c443511610064578063d45c443514610494578063d547741f146104c1578063e38335e5146104e1578063f27a0c92146104f457600080fd5b8063b08e51c014610420578063b1c5f42714610454578063c4d252f51461047457600080fd5b806364d62353146103575780638065657f146103775780638f2a0bb0146103975780638f61f4f5146103b757806391d14854146103eb578063a217fddf1461040b57600080fd5b8063248a9ca311610123578063248a9ca3146102765780632ab0f529146102a65780632f2ff15d146102d757806331d50750146102f757806336568abe14610317578063584b153e1461033757600080fd5b806301d5062a1461017657806301ffc9a71461019857806307bd0265146101cd5780630d3cf6fc1461020f578063134008d31461024357806313bc9f201461025657600080fd5b3661017157005b600080fd5b34801561018257600080fd5b50610196610191366004611357565b610509565b005b3480156101a457600080fd5b506101b86101b33660046113cc565b6105df565b60405190151581526020015b60405180910390f35b3480156101d957600080fd5b506102017fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e6381565b6040519081526020016101c4565b34801561021b57600080fd5b506102017f5f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca581565b6101966102513660046113f6565b61060a565b34801561026257600080fd5b506101b8610271366004611462565b6106bf565b34801561028257600080fd5b50610201610291366004611462565b60009081526020819052604090206001015490565b3480156102b257600080fd5b506101b86102c1366004611462565b6000908152600160208190526040909120541490565b3480156102e357600080fd5b506101966102f236600461147b565b6106e5565b34801561030357600080fd5b506101b8610312366004611462565b61070f565b34801561032357600080fd5b5061019661033236600461147b565b610728565b34801561034357600080fd5b506101b8610352366004611462565b6107ab565b34801561036357600080fd5b50610196610372366004611462565b6107c1565b34801561038357600080fd5b506102016103923660046113f6565b610865565b3480156103a357600080fd5b506101966103b23660046114ec565b6108a4565b3480156103c357600080fd5b506102017fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc181565b3480156103f757600080fd5b506101b861040636600461147b565b610a37565b34801561041757600080fd5b50610201600081565b34801561042c57600080fd5b506102017ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f78381565b34801561046057600080fd5b5061020161046f36600461159e565b610a60565b34801561048057600080fd5b5061019661048f366004611462565b610aa5565b3480156104a057600080fd5b506102016104af366004611462565b60009081526001602052604090205490565b3480156104cd57600080fd5b506101966104dc36600461147b565b610b7a565b6101966104ef36600461159e565b610b9f565b34801561050057600080fd5b50600254610201565b7fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc161053381610d29565b6000610543898989898989610865565b905061054f8184610d36565b6000817f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca8b8b8b8b8b8a60405161058b96959493929190611670565b60405180910390a383156105d457807f20fda5fd27a1ea7bf5b9567f143ac5470bb059374a27e8f67cb44f946f6d0387856040516105cb91815260200190565b60405180910390a25b505050505050505050565b60006001600160e01b031982166301ffc9a760e01b1480610604575061060482610e25565b92915050565b7fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63610636816000610a37565b610644576106448133610e5a565b6000610654888888888888610865565b90506106608185610eb3565b61066c88888888610f4f565b6000817fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b588a8a8a8a6040516106a494939291906116ad565b60405180910390a36106b581611022565b5050505050505050565b6000818152600160205260408120546001811180156106de5750428111155b9392505050565b60008281526020819052604090206001015461070081610d29565b61070a838361105b565b505050565b60008181526001602052604081205481905b1192915050565b6001600160a01b038116331461079d5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201526e103937b632b9903337b91039b2b63360891b60648201526084015b60405180910390fd5b6107a782826110df565b5050565b6000818152600160208190526040822054610721565b3330146108245760405162461bcd60e51b815260206004820152602b60248201527f54696d656c6f636b436f6e74726f6c6c65723a2063616c6c6572206d7573742060448201526a62652074696d656c6f636b60a81b6064820152608401610794565b60025460408051918252602082018390527f11c24f4ead16507c69ac467fbd5e4eed5fb5c699626d2cc6d66421df253886d5910160405180910390a1600255565b600086868686868660405160200161088296959493929190611670565b6040516020818303038152906040528051906020012090509695505050505050565b7fb09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc16108ce81610d29565b8887146108ed5760405162461bcd60e51b8152600401610794906116df565b88851461090c5760405162461bcd60e51b8152600401610794906116df565b600061091e8b8b8b8b8b8b8b8b610a60565b905061092a8184610d36565b60005b8a8110156109e85780827f4cf4410cc57040e44862ef0f45f3dd5a5e02db8eb8add648d4b0e236f1d07dca8e8e8581811061096a5761096a611722565b905060200201602081019061097f9190611738565b8d8d8681811061099157610991611722565b905060200201358c8c878181106109aa576109aa611722565b90506020028101906109bc9190611753565b8c8b6040516109d096959493929190611670565b60405180910390a36109e1816117b0565b905061092d565b508315610a2a57807f20fda5fd27a1ea7bf5b9567f143ac5470bb059374a27e8f67cb44f946f6d038785604051610a2191815260200190565b60405180910390a25b5050505050505050505050565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60008888888888888888604051602001610a81989796959493929190611858565b60405160208183030381529060405280519060200120905098975050505050505050565b7ffd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783610acf81610d29565b610ad8826107ab565b610b3e5760405162461bcd60e51b815260206004820152603160248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e2063616044820152701b9b9bdd0818994818d85b98d95b1b1959607a1b6064820152608401610794565b6000828152600160205260408082208290555183917fbaa1eb22f2a492ba1a5fea61b8df4d27c6c8b5f3971e63bb58fa14ff72eedb7091a25050565b600082815260208190526040902060010154610b9581610d29565b61070a83836110df565b7fd8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63610bcb816000610a37565b610bd957610bd98133610e5a565b878614610bf85760405162461bcd60e51b8152600401610794906116df565b878414610c175760405162461bcd60e51b8152600401610794906116df565b6000610c298a8a8a8a8a8a8a8a610a60565b9050610c358185610eb3565b60005b89811015610d135760008b8b83818110610c5457610c54611722565b9050602002016020810190610c699190611738565b905060008a8a84818110610c7f57610c7f611722565b9050602002013590503660008a8a86818110610c9d57610c9d611722565b9050602002810190610caf9190611753565b91509150610cbf84848484610f4f565b84867fc2617efa69bab66782fa219543714338489c4e9e178271560a91b82c3f612b5886868686604051610cf694939291906116ad565b60405180910390a35050505080610d0c906117b0565b9050610c38565b50610d1d81611022565b50505050505050505050565b610d338133610e5a565b50565b610d3f8261070f565b15610da45760405162461bcd60e51b815260206004820152602f60248201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e20616c60448201526e1c9958591e481cd8da19591d5b1959608a1b6064820152608401610794565b600254811015610e055760405162461bcd60e51b815260206004820152602660248201527f54696d656c6f636b436f6e74726f6c6c65723a20696e73756666696369656e746044820152652064656c617960d01b6064820152608401610794565b610e0f81426118f9565b6000928352600160205260409092209190915550565b60006001600160e01b03198216637965db0b60e01b148061060457506301ffc9a760e01b6001600160e01b0319831614610604565b610e648282610a37565b6107a757610e7181611144565b610e7c836020611156565b604051602001610e8d929190611930565b60408051601f198184030181529082905262461bcd60e51b8252610794916004016119a5565b610ebc826106bf565b610ed85760405162461bcd60e51b8152600401610794906119d8565b801580610ef45750600081815260016020819052604090912054145b6107a75760405162461bcd60e51b815260206004820152602660248201527f54696d656c6f636b436f6e74726f6c6c65723a206d697373696e6720646570656044820152656e64656e637960d01b6064820152608401610794565b6000846001600160a01b0316848484604051610f6c929190611a22565b60006040518083038185875af1925050503d8060008114610fa9576040519150601f19603f3d011682016040523d82523d6000602084013e610fae565b606091505b505090508061101b5760405162461bcd60e51b815260206004820152603360248201527f54696d656c6f636b436f6e74726f6c6c65723a20756e6465726c79696e6720746044820152721c985b9cd858dd1a5bdb881c995d995c9d1959606a1b6064820152608401610794565b5050505050565b61102b816106bf565b6110475760405162461bcd60e51b8152600401610794906119d8565b600090815260016020819052604090912055565b6110658282610a37565b6107a7576000828152602081815260408083206001600160a01b03851684529091529020805460ff1916600117905561109b3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6110e98282610a37565b156107a7576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60606106046001600160a01b03831660145b60606000611165836002611a32565b6111709060026118f9565b67ffffffffffffffff81111561118857611188611a49565b6040519080825280601f01601f1916602001820160405280156111b2576020820181803683370190505b509050600360fc1b816000815181106111cd576111cd611722565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106111fc576111fc611722565b60200101906001600160f81b031916908160001a9053506000611220846002611a32565b61122b9060016118f9565b90505b60018111156112a3576f181899199a1a9b1b9c1cb0b131b232b360811b85600f166010811061125f5761125f611722565b1a60f81b82828151811061127557611275611722565b60200101906001600160f81b031916908160001a90535060049490941c9361129c81611a5f565b905061122e565b5083156106de5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610794565b80356001600160a01b038116811461130957600080fd5b919050565b60008083601f84011261132057600080fd5b50813567ffffffffffffffff81111561133857600080fd5b60208301915083602082850101111561135057600080fd5b9250929050565b600080600080600080600060c0888a03121561137257600080fd5b61137b886112f2565b965060208801359550604088013567ffffffffffffffff81111561139e57600080fd5b6113aa8a828b0161130e565b989b979a50986060810135976080820135975060a09091013595509350505050565b6000602082840312156113de57600080fd5b81356001600160e01b0319811681146106de57600080fd5b60008060008060008060a0878903121561140f57600080fd5b611418876112f2565b955060208701359450604087013567ffffffffffffffff81111561143b57600080fd5b61144789828a0161130e565b979a9699509760608101359660809091013595509350505050565b60006020828403121561147457600080fd5b5035919050565b6000806040838503121561148e57600080fd5b8235915061149e602084016112f2565b90509250929050565b60008083601f8401126114b957600080fd5b50813567ffffffffffffffff8111156114d157600080fd5b6020830191508360208260051b850101111561135057600080fd5b600080600080600080600080600060c08a8c03121561150a57600080fd5b893567ffffffffffffffff8082111561152257600080fd5b61152e8d838e016114a7565b909b50995060208c013591508082111561154757600080fd5b6115538d838e016114a7565b909950975060408c013591508082111561156c57600080fd5b506115798c828d016114a7565b9a9d999c50979a969997986060880135976080810135975060a0013595509350505050565b60008060008060008060008060a0898b0312156115ba57600080fd5b883567ffffffffffffffff808211156115d257600080fd5b6115de8c838d016114a7565b909a50985060208b01359150808211156115f757600080fd5b6116038c838d016114a7565b909850965060408b013591508082111561161c57600080fd5b506116298b828c016114a7565b999c989b509699959896976060870135966080013595509350505050565b81835281816020850137506000828201602090810191909152601f909101601f19169091010190565b60018060a01b038716815285602082015260a06040820152600061169860a083018688611647565b60608301949094525060800152949350505050565b60018060a01b03851681528360208201526060604082015260006116d5606083018486611647565b9695505050505050565b60208082526023908201527f54696d656c6f636b436f6e74726f6c6c65723a206c656e677468206d69736d616040820152620e8c6d60eb1b606082015260800190565b634e487b7160e01b600052603260045260246000fd5b60006020828403121561174a57600080fd5b6106de826112f2565b6000808335601e1984360301811261176a57600080fd5b83018035915067ffffffffffffffff82111561178557600080fd5b60200191503681900382131561135057600080fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016117c2576117c261179a565b5060010190565b818352600060208085019450848460051b86018460005b8781101561184b5783830389528135601e1988360301811261180157600080fd5b8701858101903567ffffffffffffffff81111561181d57600080fd5b80360382131561182c57600080fd5b611837858284611647565b9a87019a94505050908401906001016117e0565b5090979650505050505050565b60a0808252810188905260008960c08301825b8b811015611899576001600160a01b03611884846112f2565b1682526020928301929091019060010161186b565b5083810360208501528881526001600160fb1b038911156118b957600080fd5b8860051b9150818a602083013701828103602090810160408501526118e190820187896117c9565b60608401959095525050608001529695505050505050565b808201808211156106045761060461179a565b60005b8381101561192757818101518382015260200161190f565b50506000910152565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161196881601785016020880161190c565b7001034b99036b4b9b9b4b733903937b6329607d1b601791840191820152835161199981602884016020880161190c565b01602801949350505050565b60208152600082518060208401526119c481604085016020870161190c565b601f01601f19169190910160400192915050565b6020808252602a908201527f54696d656c6f636b436f6e74726f6c6c65723a206f7065726174696f6e206973604082015269206e6f7420726561647960b01b606082015260800190565b8183823760009101908152919050565b80820281158282048414176106045761060461179a565b634e487b7160e01b600052604160045260246000fd5b600081611a6e57611a6e61179a565b50600019019056fea26469706673582212202660e89b75cbc613ce1adfd28441fdd49cd7cd30f5c64ebef4b5bc67cf8c12ea64736f6c634300081100335f58e3a2316349923ce3780f8d587db2d72378aed66a8261c916544fa6846ca5b09aa5aeb3702cfd50b6b62bc4532604938f21248a27a1d5ca736082b6819cc1d8aa0f3194971a2a116679f7c2090f6939c8d4e01a2a8d7e41d55e5351469e63fd643c72710c63c0180259aba6b2d05451e3591a24e58b62239378085726f783";

type TimelockControllerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TimelockControllerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TimelockController__factory extends ContractFactory {
  constructor(...args: TimelockControllerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    minDelay: PromiseOrValue<BigNumberish>,
    proposers: PromiseOrValue<string>[],
    executors: PromiseOrValue<string>[],
    admin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TimelockController> {
    return super.deploy(
      minDelay,
      proposers,
      executors,
      admin,
      overrides || {}
    ) as Promise<TimelockController>;
  }
  override getDeployTransaction(
    minDelay: PromiseOrValue<BigNumberish>,
    proposers: PromiseOrValue<string>[],
    executors: PromiseOrValue<string>[],
    admin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      minDelay,
      proposers,
      executors,
      admin,
      overrides || {}
    );
  }
  override attach(address: string): TimelockController {
    return super.attach(address) as TimelockController;
  }
  override connect(signer: Signer): TimelockController__factory {
    return super.connect(signer) as TimelockController__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TimelockControllerInterface {
    return new utils.Interface(_abi) as TimelockControllerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TimelockController {
    return new Contract(address, _abi, signerOrProvider) as TimelockController;
  }
}
