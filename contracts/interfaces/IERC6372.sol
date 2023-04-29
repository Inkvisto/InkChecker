// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;


interface IERC6372 {

    function clock() external view returns (uint48);

// solhint-disable-next-line func-name-mixedcase
    function CLOCK_MODE() external view returns (string memory);
    
}