import { ethers } from "hardhat";


export const toEthersBN = (num: number | string) => ethers.BigNumber.from(num);

export const toEnum = (...obj: string[]) => Object.fromEntries(obj.map((key: string, i: number) => [key, toEthersBN(i)]))