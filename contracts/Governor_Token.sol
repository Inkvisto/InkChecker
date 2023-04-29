// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;


import './ERC20/ERC20.sol';
import './ERC20/extensions/ERC20Votes.sol';
import './ERC20/extensions/ERC20Permit.sol';
import './utils/Ownable.sol';
import "./utils/cryptography/ECDSA.sol";

contract Governor_Token is ERC20, ERC20Permit, Ownable, ERC20Votes {
    constructor() ERC20("Ink_Votes", "ITK")  ERC20Permit("Ink_Votes") {}

        event Mint(address indexed to, uint _amount);
        event Burn(address indexed to, uint _amount);

     function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
         emit Mint(to, amount);
    }

     function burn(address to, uint256 amount) public onlyOwner {
        _burn(to, amount);
         emit Burn(to, amount);
    }

    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}