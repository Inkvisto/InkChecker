import { ethers } from "hardhat";
import { BigNumber } from 'ethers';

export const toEthersBN = (num: number | string): BigNumber => ethers.BigNumber.from(num);

export const toEnum = (...obj: string[]) => Object.fromEntries(obj.map((key: string, i: number) => [key, toEthersBN(i)]))