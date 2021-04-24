//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "./Erc20Base.sol";

contract TokenBsc is Erc20Base {
    constructor() Erc20Base("BSC Token", "BTK") {}
}
