//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "./IToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeBase is Ownable {
    address public admin;
    IToken public token;
    uint256 public nonce;
    mapping(uint256 => bool) public processedNonces;

    enum Step {Mint, Burn}

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 ammount,
        uint256 date,
        uint256 nonceOfEthereumChain,
        Step indexed step
    );

    constructor(address _token) {
        admin = msg.sender;
        token = IToken(_token);
    }

    function burn(address to, uint256 amount) external {
        token.burn(msg.sender, amount);
        emit Transfer(
            msg.sender,
            to,
            amount,
            block.timestamp,
            nonce,
            Step.Burn
        );
        nonce++;
    }

    function mint(
        address to,
        uint256 amount,
        uint256 otherChainNonce
    ) external {
        require(msg.sender == admin, "caller is not the owner");
        require(
            !processedNonces[otherChainNonce],
            "transfer already processed"
        );
        token.mint(to, amount);
        emit Transfer(
            msg.sender,
            to,
            amount,
            block.timestamp,
            nonce,
            Step.Mint
        );
        processedNonces[otherChainNonce] = true;
    }
}
