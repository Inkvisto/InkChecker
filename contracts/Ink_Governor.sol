// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import './governance/Governor.sol';
import './governance/extensions/GovernorVotes.sol';
import './governance/extensions/GovernorVotesQuorumFraction.sol';
import './governance/extensions/GovernorCountingSimple.sol';
import './governance/extensions/GovernorSettings.sol';

contract Ink_Governor is Governor, GovernorSettings, GovernorCountingSimple, GovernorVotes, GovernorVotesQuorumFraction {
    constructor(IVotes _token)
        Governor("Ink_Governor")
        GovernorSettings(4 /* 4 block */, 300 /* 1 hour */, 0)
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
    {}

   function cancel_(
         address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public returns (uint256) {
        return super._cancel(targets,values,calldatas,descriptionHash);
    }

    // The following functions are overrides required by Solidity.

   function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }
    
}