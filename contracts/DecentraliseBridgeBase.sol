//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "./IToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DecentraliseBridgeBase is Ownable {
    address public admin;
    IToken public token;
    mapping(address => mapping(uint256 => bool)) public processedNonces;

    enum Step {Mint, Burn}

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 ammount,
        uint256 date,
        uint256 nonceOfEthereumChain,
        bytes signature,
        Step indexed step
    );

    constructor(address _token) {
        admin = msg.sender;
        token = IToken(_token);
    }

    function burn(
        address to,
        uint256 amount,
        bytes calldata signature,
        uint256 nonce
    ) external {
        require(
            !processedNonces[msg.sender][nonce],
            "transfer already processed"
        );
        processedNonces[msg.sender][nonce] = true;
        token.burn(msg.sender, amount);
        emit Transfer(
            msg.sender,
            to,
            amount,
            block.timestamp,
            nonce,
            signature,
            Step.Burn
        );
    }

    function mint(
        address from,
        address to,
        uint256 amount,
        uint256 otherChainNonce,
        bytes calldata signature
    ) external {
        require(
            !processedNonces[from][otherChainNonce],
            "transfer already processed"
        );
        bytes32 messageHash =
            getEthSignedMessagehash(
                keccak256(abi.encodePacked(from, to, amount, otherChainNonce))
            );
        require(
            recoverSigner(messageHash, signature) == from,
            "wrong signature"
        );

        token.mint(to, amount);
        emit Transfer(
            from,
            to,
            amount,
            block.timestamp,
            otherChainNonce,
            signature,
            Step.Mint
        );
        processedNonces[from][otherChainNonce] = true;
    }

    function getEthSignedMessagehash(bytes32 messageHash)
        internal
        pure
        returns (bytes32)
    {
        return (
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    messageHash
                )
            )
        );
    }

    function recoverSigner(bytes32 ethSignedMessageHash, bytes memory sig)
        internal
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(sig);
        return ecrecover(ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        require(sig.length == 65, "invalid signature length");
        assembly {
            r := mload(add(sig, 32)) //add(sig,32) ==> Skips first 32 bytes . mload(something)=> load next 32bytes starting at memory address something
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
