// contracts/MessageBoard.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SocialNetwork is ERC20("Social Network", "SN") {
    // Số lượng token tối đa có thể phát hành
    uint256 public constant MAX_SUPPLY = 1000000000 * 10 ** 18;
    
    // Số lượng token dành cho reward (49% tổng cung)
    uint256 public constant REWARD_SUPPLY = (MAX_SUPPLY * 49) / 100;

    // Số lượng token dành cho developers (51% tổng cung)
    uint256 public constant DEVELOPERS_SUPPLY = (MAX_SUPPLY * 51) / 100;

    constructor() {
        _mint(msg.sender, DEVELOPERS_SUPPLY);
    }

    function mint(address to, uint256 amount) public {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(to, amount);
    }    
    
}

