"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inTransaction = exports.notEmitted = exports.inIndirectReceipt = exports.expectEvent = void 0;
const chai_1 = require("chai");
const ethers_1 = require("ethers");
// Ported from @openzeppelin/test-helpers to use with Ethers. The Test Helpers don't
// yet have Typescript typings, so we're being lax about them here.
// See https://github.com/OpenZeppelin/openzeppelin-test-helpers/issues/122
/* eslint-disable @typescript-eslint/no-explicit-any */
function expectEvent(receipt, eventName, eventArgs = {}) {
    if (receipt.events == undefined) {
        throw new Error('No events found in receipt');
    }
    const events = receipt.events.filter((e) => e.event === eventName);
    (0, chai_1.expect)(events.length > 0).to.equal(true, `No '${eventName}' events found`);
    const exceptions = [];
    const event = events.find(function (e) {
        for (const [k, v] of Object.entries(eventArgs)) {
            try {
                if (e.args == undefined) {
                    throw new Error('Event has no arguments');
                }
                contains(e.args, k, v);
            }
            catch (error) {
                if (error instanceof Error)
                    exceptions.push(error.message);
                return false;
            }
        }
        return true;
    });
    if (event === undefined) {
        // Each event entry may have failed to match for different reasons,
        // throw the first one
        throw exceptions[0];
    }
    return event;
}
exports.expectEvent = expectEvent;
function inIndirectReceipt(receipt, emitter, eventName, eventArgs = {}, address, amount) {
    const expectedEvents = arrayFromIndirectReceipt(receipt, emitter, eventName, address);
    if (amount === undefined) {
        (0, chai_1.expect)(expectedEvents.length > 0).to.equal(true, `No '${eventName}' events found`);
    }
    else {
        (0, chai_1.expect)(expectedEvents.length).to.equal(amount, `${expectedEvents.length} '${eventName}' events found; expected ${amount}`);
    }
    const exceptions = [];
    const event = expectedEvents.find(function (e) {
        for (const [k, v] of Object.entries(eventArgs)) {
            try {
                if (e.args == undefined) {
                    throw new Error('Event has no arguments');
                }
                contains(e.args, k, v);
            }
            catch (error) {
                if (error instanceof Error)
                    exceptions.push(error.message);
                return false;
            }
        }
        return true;
    });
    if (event === undefined) {
        // Each event entry may have failed to match for different reasons,
        // throw the first one
        throw exceptions[0];
    }
    return event;
}
exports.inIndirectReceipt = inIndirectReceipt;
function notEmitted(receipt, eventName) {
    if (receipt.events != undefined) {
        const events = receipt.events.filter((e) => e.event === eventName);
        (0, chai_1.expect)(events.length > 0).to.equal(false, `'${eventName}' event found`);
    }
}
exports.notEmitted = notEmitted;
function arrayFromIndirectReceipt(receipt, emitter, eventName, address) {
    const decodedEvents = receipt.logs
        .filter((log) => (address ? log.address.toLowerCase() === address.toLowerCase() : true))
        .map((log) => {
        try {
            return emitter.parseLog(log);
        }
        catch {
            return undefined;
        }
    })
        .filter((e) => e !== undefined);
    return decodedEvents.filter((event) => event.name === eventName);
}
function contains(args, key, value) {
    (0, chai_1.expect)(key in args).to.equal(true, `Event argument '${key}' not found`);
    if (value === null) {
        (0, chai_1.expect)(args[key]).to.equal(null, `expected event argument '${key}' to be null but got ${args[key]}`);
    }
    else if (ethers_1.BigNumber.isBigNumber(args[key]) || ethers_1.BigNumber.isBigNumber(value)) {
        const actual = ethers_1.BigNumber.isBigNumber(args[key]) ? args[key].toString() : args[key];
        const expected = ethers_1.BigNumber.isBigNumber(value) ? value.toString() : value;
        (0, chai_1.expect)(args[key]).to.equal(value, `expected event argument '${key}' to have value ${expected} but got ${actual}`);
    }
    else {
        (0, chai_1.expect)(args[key]).to.be.deep.equal(value, `expected event argument '${key}' to have value ${value} but got ${args[key]}`);
    }
}
async function inTransaction(receipt, tx, emitter, eventName, eventArgs = {}) {
    let abi;
    let address;
    const { logs } = receipt;
    // decodeLogs(receipt.tx.logs, emitter, eventName);
    receipt.logs.forEach((log) => {
        console.log(emitter.interface.parseLog(log));
    });
    let eventABI = receipt.events.filter(x => x.event === eventName);
    if (eventABI.length === 0) {
        throw new Error(`No ABI entry for event '${eventName}'`);
    }
    else if (eventABI.length > 1) {
        throw new Error(`Multiple ABI entries for event '${eventName}', only uniquely named events are supported`);
    }
    eventABI = eventABI[0];
    // The first topic will equal the hash of the event signature
    const eventSignature = `${eventName}(${eventABI.inputs.map(input => input.type).join(',')})`;
    const eventTopic = web3.utils.sha3(eventSignature);
    // Only decode events of type 'EventName'
    const decodedLogs = logs
        .map(log => web3.eth.abi.decodeLog(eventABI.inputs, log.data, log.topics.slice(1)))
        .map(decoded => ({ event: eventName, args: decoded }));
    console.log(decodedLogs);
    return expectEvent(transactionReceipt, eventName, eventArgs);
}
exports.inTransaction = inTransaction;
