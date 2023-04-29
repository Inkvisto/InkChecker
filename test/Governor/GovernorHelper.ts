import { mineUpTo, time } from '@nomicfoundation/hardhat-network-helpers';
import { ethers } from 'hardhat';
import { Address } from 'hardhat-deploy/types';
import web3 from 'web3'
import { ERC20Votes, Governor, Ink_Governor, Ink_Timelock_Governor,} from '../../typechain-types';
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from 'ethers';
import { toEthersBN } from '../utils/typeConverters';

type proposalPartsType = (string | BigNumber[] | string[])[];

type proposalType = {
  id:BigNumber,
  targets:[Address],
  values:[BigNumber] | [string],
  calldatas:[string],
  description:string,
  descriptionHash:string,
  shortProposal:proposalPartsType,
  fullProposal:proposalPartsType,
};


let proposal:proposalType;

const GovernorHelper = (governor: Ink_Governor | Ink_Timelock_Governor, mode = 'blocknumber') => ({

  async delegate(token:ERC20Votes,from:SignerWithAddress,to:Address,value:number) {
    await (await token.connect(from).delegate(to)).wait();
    await (await token.transfer(to, value)).wait();
  },

  async propose(proposer:SignerWithAddress | null = null) {

    if(proposer)  {
      return (await governor.connect(proposer).propose(...proposal.fullProposal)).wait();
    }
    return (await governor.propose(...proposal.fullProposal)).wait();
  },
  async queue() {
    return await governor.queue(...proposal.shortProposal);
  },

  async execute(opts = null) {
 
  const executedTx = await governor.execute(...proposal.shortProposal)


    return executedTx
  },

  async cancel(visibility = 'external', opts = null) {
  

    switch (visibility) {
      case 'external':
        return governor.cancel(
          ...proposal.shortProposal,
        );
      case 'internal':
        return governor.cancel_(
          ...proposal.shortProposal,
        );
      default:
        throw new Error(`unsuported visibility "${visibility}"`);
    }
  },

  vote(vote = {}) {
      return governor.connect(vote.voter).castVote(proposal.id, vote.support);
  },

  async waitForSnapshot(offset = 0) {

    const timepoint = await governor.proposalSnapshot(proposal.id);    
    
    return mineUpTo(timepoint.add(offset));
  },

  async waitForDeadline(offset = 0) {
  
    const timepoint = await governor.proposalDeadline(proposal.id);    
    
    return mineUpTo(timepoint.add(offset));
  },

  async waitForEta(offset = 0) {
    const timestamp = await governor.proposalEta(proposal.id);
    
    return mineUpTo(timestamp.add(offset));
  },

  setProposal(actions:Partial<{ targets:[Address] | [], values: [BigNumber] | [], calldatas:[string] | []}> , description:string) {

     const { targets, values = [toEthersBN(0)], calldatas = ['0x'] } = actions;
    


    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(description));

    // condensed version for queueing end executing
    const shortProposal = [targets, values, calldatas, descriptionHash];

    // full version for proposing
    const fullProposal = [targets, values, calldatas, description];

    // proposal id
    const id = ethers.BigNumber.from(
      ethers.utils.keccak256(
       ethers.utils.defaultAbiCoder.encode(['address[]', 'uint256[]', 'bytes[]', 'bytes32'], shortProposal),
      ),
    );
   
    

    proposal = {
      id,
      targets,
      values,
      calldatas,
      description,
      descriptionHash,
      shortProposal,
      fullProposal,
    } as const;

    return proposal;
  }
})




 export default GovernorHelper;
