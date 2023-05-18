"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEnum = exports.toEthersBN = void 0;
const hardhat_1 = require("hardhat");
const toEthersBN = (num) => hardhat_1.ethers.BigNumber.from(num);
exports.toEthersBN = toEthersBN;
const toEnum = (...obj) => Object.fromEntries(obj.map((key, i) => [key, (0, exports.toEthersBN)(i)]));
exports.toEnum = toEnum;
