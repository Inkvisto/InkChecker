// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./Initializable.sol";

contract Implementation2 is Initializable {
    uint internal _value;

    function initialize() public initializer {}

    function setValue(uint _number) public {
        _value = _number;
    }

    function getValue() public view returns (uint) {
        return _value;
    }
}

contract CallReceiverMock {
    event MockFunctionCalled();
    event MockFunctionCalledWithArgs(uint256 a, uint256 b);

    uint256[] private _array;

    function mockFunction() public payable returns (string memory) {
        emit MockFunctionCalled();

        return "0x1234";
    }

    function mockFunctionRevertsNoReason() public pure returns (string memory) {
        revert();
    }

    function mockFunctionRevertsReason() public payable {
        revert("CallReceiverMock: reverting");
    }

    function mockFunctionThrows() public payable {
        assert(false);
    }

    function mockFunctionOutOfGas() public payable {
        for (uint256 i = 0; ; ++i) {
            _array.push(i);
        }
    }
}
