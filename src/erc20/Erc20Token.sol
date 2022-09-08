pragma solidity 0.8.16;

import "../contracts/token/ERC20/ERC20.sol";

contract Erc20Token is ERC20 {
    constructor() ERC20("Erc20Token", "TOKEN20") {
        uint256 totalSupply = 1000000 * 10**18;

        _mint(msg.sender, totalSupply);
    }
}
