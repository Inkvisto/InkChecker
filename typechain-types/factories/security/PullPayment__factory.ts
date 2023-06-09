/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  PullPayment,
  PullPaymentInterface,
} from "../../security/PullPayment";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "dest",
        type: "address",
      },
    ],
    name: "payments",
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
        internalType: "address payable",
        name: "payee",
        type: "address",
      },
    ],
    name: "withdrawPayments",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class PullPayment__factory {
  static readonly abi = _abi;
  static createInterface(): PullPaymentInterface {
    return new utils.Interface(_abi) as PullPaymentInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PullPayment {
    return new Contract(address, _abi, signerOrProvider) as PullPayment;
  }
}
