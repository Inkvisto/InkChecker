"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hardhat_network_helpers_1 = require("@nomicfoundation/hardhat-network-helpers");
const hardhat_1 = require("hardhat");
const typeConverters_1 = require("../utils/typeConverters");
let proposal;
const GovernorHelper = (governor, mode = 'blocknumber') => ({
    async delegate(token, from, to, value) {
        await (await token.connect(from).delegate(to)).wait();
        await (await token.transfer(to, value)).wait();
    },
    async propose(proposer = null) {
        if (proposer) {
            return (await governor.connect(proposer).propose(...proposal.fullProposal)).wait();
        }
        return (await governor.propose(...proposal.fullProposal)).wait();
    },
    async queue() {
        return await governor.queue(...proposal.shortProposal);
    },
    async execute(opts = null) {
        const executedTx = await governor.execute(...proposal.shortProposal);
        return executedTx;
    },
    async cancel(visibility = 'external', opts = null) {
        switch (visibility) {
            case 'external':
                return governor.cancel(...proposal.shortProposal);
            case 'internal':
                return governor.cancel_(...proposal.shortProposal);
            default:
                throw new Error(`unsuported visibility "${visibility}"`);
        }
    },
    vote(vote = {}) {
        return governor.connect(vote.voter).castVote(proposal.id, vote.support);
    },
    async waitForSnapshot(offset = 0) {
        const timepoint = await governor.proposalSnapshot(proposal.id);
        return (0, hardhat_network_helpers_1.mineUpTo)(timepoint.add(offset));
    },
    async waitForDeadline(offset = 0) {
        const timepoint = await governor.proposalDeadline(proposal.id);
        return (0, hardhat_network_helpers_1.mineUpTo)(timepoint.add(offset));
    },
    async waitForEta(offset = 0) {
        const timestamp = await governor.proposalEta(proposal.id);
        return (0, hardhat_network_helpers_1.mineUpTo)(timestamp.add(offset));
    },
    setProposal(actions, description) {
        const { targets, values = [(0, typeConverters_1.toEthersBN)(0)], calldatas = ['0x'] } = actions;
        const descriptionHash = hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.toUtf8Bytes(description));
        // condensed version for queueing end executing
        const shortProposal = [targets, values, calldatas, descriptionHash];
        // full version for proposing
        const fullProposal = [targets, values, calldatas, description];
        // proposal id
        const id = hardhat_1.ethers.BigNumber.from(hardhat_1.ethers.utils.keccak256(hardhat_1.ethers.utils.defaultAbiCoder.encode(['address[]', 'uint256[]', 'bytes[]', 'bytes32'], shortProposal)));
        proposal = {
            id,
            targets,
            values,
            calldatas,
            description,
            descriptionHash,
            shortProposal,
            fullProposal,
        };
        return proposal;
    }
});
exports.default = GovernorHelper;
