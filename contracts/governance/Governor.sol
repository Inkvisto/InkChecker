// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;


import "../utils/cryptography/EIP712.sol";
import "../utils/cryptography/ECDSA.sol";
import "../utils/math/SafeCast.sol";
import "../utils/introspection/ERC165.sol";
import "../utils/structs/DoubleEndedQueue.sol";
import "../utils/Address.sol";
import "../utils/Context.sol";
import "./IGovernor.sol";


abstract contract Governor  is Context, ERC165, IGovernor, EIP712 {
    using DoubleEndedQueue for DoubleEndedQueue.Bytes32Deque;
    using SafeCast for uint256;

    bytes32 public constant BALLOT_TYPEHASH = keccak256("Ballot(uint256 proposalId,uint8 support)");
    bytes32 public constant EXTENDED_BALLOT_TYPEHASH = keccak256("ExtendedBallot(uint256 proposalId,uint8 support, string reason, bytes params)");

    struct ProposalCore {
        uint64 voteStart;
        address proposer;
        bytes4 __gap_unused0;
        uint64 voteEnd;
        bytes24 __gap_unused1;
        bool executed;
        bool canceled;
    }

    string private _name;

    mapping(uint256 => ProposalCore) private _proposals;
    DoubleEndedQueue.Bytes32Deque private _governanceCall;

    modifier onlyGovernance() {
        require(_msgSender() == _executor(), "Governor: onlyGovernance");
        if(_executor() != address(this)) {
            bytes32 msgDataHash = keccak256(_msgData());
            while(_governanceCall.popFront() != msgDataHash) {}
        }
        _;
    }

    constructor(string memory name_) EIP712(name_, version()) {
        _name = name_;
    }

    receive() external payable virtual {
        require(_executor() == address(this));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165, ERC165) returns (bool) {
       return
            interfaceId ==
            (type(IGovernor).interfaceId ^
                type(IERC6372).interfaceId ^
                this.cancel.selector ^
                this.castVoteWithReasonAndParams.selector ^
                this.getVotesWithParams.selector) ||
            interfaceId == (type(IGovernor).interfaceId ^ type(IERC6372).interfaceId ^ this.cancel.selector) ||
            super.supportsInterface(interfaceId);
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function version() public view virtual override returns (string memory) {
        return "1";
    }

    function hashProposal(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public pure virtual override returns (uint256) {
        return uint256(keccak256(abi.encode(targets, values, calldatas, descriptionHash)));
    }


    function state(uint256 proposalId) public view virtual override returns (ProposalState) {
        ProposalCore storage proposal = _proposals[proposalId];

        if(proposal.executed) {
            return ProposalState.Executed;
        }

        if(proposal.canceled) {
            return ProposalState.Canceled;
        }

        uint256 snapshot = proposalSnapshot(proposalId);

        if(snapshot == 0) {
            revert("Governor: unknown proposal id");
        }

        uint256 currentTimepoint = clock();

        if(snapshot >= currentTimepoint) {
            return ProposalState.Pending;
        }

        uint256 deadline = proposalDeadline(proposalId);

        if(deadline >= currentTimepoint) {
            return ProposalState.Active;
        }

        if(_quorumReached(proposalId) && _voteSucceeded(proposalId)) {
            return ProposalState.Succeeded;
        } else {
            return ProposalState.Defeated;
        }
    } 

    function proposalThreshold() public view virtual returns (uint256) {
        return 0;
    }

    function proposalSnapshot(uint256 proposalId) public view virtual override returns (uint256) {
        return _proposals[proposalId].voteStart;
    }

      function proposalDeadline(uint256 proposalId) public view virtual override returns (uint256) {
        return _proposals[proposalId].voteEnd;
    }

    function _quorumReached(uint256 proposalId) internal view virtual returns (bool);

      function _voteSucceeded(uint256 proposalId) internal view virtual returns (bool);

    function _getVotes(address account,uint256 timepoint, bytes memory params) internal view virtual returns (uint256);

    function _countVote(
        uint256 proposalId,
        address account,
        uint8 suppport,
        uint256 weight,
        bytes memory params
    ) internal virtual;

    function _defaultParams() internal view virtual returns (bytes memory) {
        return "";
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    ) public virtual override returns (uint256) {
        address proposer = _msgSender();
        uint256 currentTimepoint = clock();

        require(
            getVotes(proposer, currentTimepoint - 1) >= proposalThreshold(),
            "Governor: proposer votes below proposal threshold"
        );

        uint256 proposalId = hashProposal(targets, values, calldatas, keccak256(bytes(description)));

        require(targets.length == values.length, "Governor: invalid proposal length");
        require(targets.length == calldatas.length,"Governor: invalid proposal length");
        require(targets.length > 0, "Governor: empty proposal");
        require(_proposals[proposalId].voteStart == 0, "Governor: proposal already exists");

        uint256 snapshot = currentTimepoint + votingDelay();
        uint256 deadline = snapshot + votingPeriod();

      _proposals[proposalId] = ProposalCore({
            proposer: proposer,
            voteStart: snapshot.toUint64(),
            voteEnd: deadline.toUint64(),
            executed: false,
            canceled: false,
            __gap_unused0: 0,
            __gap_unused1: 0
        });

        emit ProposalCreated(
            proposalId,
            proposer,
            targets,
            values,
            new string[](targets.length),
            calldatas,
            snapshot,
            deadline,
            description
        );
        return proposalId;
    }

    function execute(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) public payable virtual override returns (uint256) {
        uint256 proposalId = hashProposal(targets, values, calldatas, descriptionHash);

        ProposalState status = state(proposalId);
        require(
            status == ProposalState.Succeeded || status == ProposalState.Queued,
            "Governor: proposal not successful"
        );
        _proposals[proposalId].executed = true;

        emit ProposalExecuted(proposalId);

        _beforeExecute(proposalId, targets, values, calldatas, descriptionHash);
        _execute(proposalId, targets, values, calldatas, descriptionHash);
        _afterExecute(proposalId, targets, values, calldatas, descriptionHash);

        return proposalId;
    }

function cancel(
    address[] memory targets,
    uint256[] memory values,
    bytes[] memory calldatas,
    bytes32 descriptionHash
) public virtual override returns (uint256) {
    uint256 proposalId = hashProposal(targets, values, calldatas, descriptionHash);
    require(state(proposalId) == ProposalState.Pending, "Governor: too late to cancel");
    require(_msgSender() == _proposals[proposalId].proposer,"Governor: only proposer can cancel");
    return _cancel(targets, values, calldatas, descriptionHash);

}

   function _execute(
        uint256 ,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 
    ) internal virtual {
        string memory errorMessage = "Governor: call reverted without message";
        for (uint256 i = 0; i < targets.length; ++i) {
            (bool success, bytes memory returndata) = targets[i].call{value: values[i]}(calldatas[i]);
            Address.verifyCallResult(success, returndata, errorMessage);
        }
    }

function _beforeExecute(
    uint256,
    address[] memory targets,
    uint256[] memory,
    bytes[] memory calldatas,
    bytes32
) internal virtual {
      if (_executor() != address(this)) {
            for (uint256 i = 0; i < targets.length; ++i) {
                if (targets[i] == address(this)) {
                    _governanceCall.pushBack(keccak256(calldatas[i]));
                }
            }
        }
}

 function _afterExecute(
        uint256,
        address[] memory,
        uint256[] memory,
        bytes[] memory,
        bytes32 
    ) internal virtual {
        if (_executor() != address(this)) {
            if (!_governanceCall.empty()) {
                _governanceCall.clear();
            }
        }
    }

     function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal virtual returns (uint256) {
        uint256 proposalId = hashProposal(targets, values, calldatas, descriptionHash);

        ProposalState status = state(proposalId);

        require(
            status != ProposalState.Canceled && status != ProposalState.Expired && status != ProposalState.Executed,
            "Governor: proposal not active"
        );
        _proposals[proposalId].canceled = true;

        emit ProposalCanceled(proposalId);

        return proposalId;
    }

  function getVotes(address account, uint256 timepoint) public view virtual override returns (uint256) {
        return _getVotes(account, timepoint, _defaultParams());
    }

      function getVotesWithParams(
        address account,
        uint256 timepoint,
        bytes memory params
    ) public view virtual override returns (uint256) {
        return _getVotes(account, timepoint, params);
    }

      function castVote(uint256 proposalId, uint8 support) public virtual override returns (uint256) {
        address voter = _msgSender();
        return _castVote(proposalId, voter, support, "");
    }

     function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) public virtual override returns (uint256) {
        address voter = _msgSender();
        return _castVote(proposalId, voter, support, reason);
    }



      function castVoteWithReasonAndParams(
        uint256 proposalId,
        uint8 support,
        string calldata reason,
        bytes memory params
    ) public virtual override returns (uint256) {
        address voter = _msgSender();
        return _castVote(proposalId, voter, support, reason, params);
    }


        function castVoteBySig(
        uint256 proposalId,
        uint8 support,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual override returns (uint256) {
        address voter = ECDSA.recover(
            _hashTypedDataV4(keccak256(abi.encode(BALLOT_TYPEHASH, proposalId, support))),
            v,
            r,
            s
        );
        return _castVote(proposalId, voter, support, "");
    }


        function castVoteWithReasonAndParamsBySig(
        uint256 proposalId,
        uint8 support,
        string calldata reason,
        bytes memory params,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public virtual override returns (uint256) {
        address voter = ECDSA.recover(
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        EXTENDED_BALLOT_TYPEHASH,
                        proposalId,
                        support,
                        keccak256(bytes(reason)),
                        keccak256(params)
                    )
                )
            ),
            v,
            r,
            s
        );

        return _castVote(proposalId, voter, support, reason, params);
    }

  function _castVote(
        uint256 proposalId,
        address account,
        uint8 support,
        string memory reason
    ) internal virtual returns (uint256) {
        return _castVote(proposalId, account, support, reason, _defaultParams());
    }

    function _castVote(
        uint256 proposalId,
        address account,
        uint8 support,
        string memory reason,
        bytes memory params
    ) internal virtual returns (uint256) {
        ProposalCore storage proposal = _proposals[proposalId];
        require(state(proposalId) == ProposalState.Active, "Governor: vote not currently active");

        uint256 weight = _getVotes(account, proposal.voteStart, params);
        _countVote(proposalId, account, support, weight, params);

        if (params.length == 0) {
            emit VoteCast(account, proposalId, support, weight, reason);
        } else {
            emit VoteCastWithParams(account, proposalId, support, weight, reason, params);
        }

        return weight;
    }


 function relay(address target, uint256 value, bytes calldata data) external payable virtual onlyGovernance {
        (bool success, bytes memory returndata) = target.call{value: value}(data);
        Address.verifyCallResult(success, returndata, "Governor: relay reverted without message");
    }

     function _executor() internal view virtual returns (address) {
        return address(this);
    }
    
}