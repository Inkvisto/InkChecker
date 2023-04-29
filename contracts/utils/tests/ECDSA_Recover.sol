// SPDX-License-Identifier: MIT
pragma solidity >=0.8.9;

import "../cryptography/ECDSA.sol";
import "../cryptography/EIP712.sol";
import '../../ERC20/extensions/ERC20Permit.sol';
import '../../ERC20/ERC20.sol';

contract ECDSA_Recover is ERC20, EIP712, ERC20Permit {
    bytes32 private constant _DELEGATION_TYPEHASH =
        keccak256("Delegation(address delegatee,uint256 nonce,uint256 expiry)");

    constructor() ERC20("ECDSA_Token", "ETK") ERC20Permit("ECDSA_Recover"){}

    function recover(bytes calldata signature) public view returns (address) {
        bytes32 hash = keccak256(abi.encodePacked(msg.sender));
        bytes32 message = ECDSA.toEthSignedMessageHash(hash);
        address signer = ECDSA.recover(message, signature);
        return signer;
    }

    function delegateBySig_recover(
        address delegatee,
        uint256 nonce,
        uint256 expiry,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public view returns ( address ){
        address signer = ECDSA.recover(   
            _hashTypedDataV4(
                keccak256(
                    abi.encode(_DELEGATION_TYPEHASH, delegatee, nonce, expiry)
                )
            ),
            v,
            r,
            s
        );
       return signer;
    }

    
}
