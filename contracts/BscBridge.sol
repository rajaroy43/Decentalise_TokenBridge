//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "./DecentraliseBridgeBase.sol";

contract BscBridge is DecentraliseBridgeBase {
    constructor(address token) DecentraliseBridgeBase(token) {}
}
