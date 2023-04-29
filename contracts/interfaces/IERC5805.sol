// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;


import "../governance/utils/IVotes.sol";
import "./IERC6372.sol";

interface IERC5805 is IERC6372, IVotes {}