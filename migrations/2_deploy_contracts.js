const TokenEth = artifacts.require("TokenEth.sol");
const TokenBsc = artifacts.require("TokenBsc.sol");
const EthBridge = artifacts.require("EthBridge.sol");
const BscBridge = artifacts.require("BscBridge.sol");
const {
  BN, // Big Number support
  constants, // Common constants, like the zero address and largest integers
  expectEvent, // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require("@openzeppelin/test-helpers");
const amount = new BN("1000000000000000000000");
module.exports = async function (deployer, network, addresses) {
  if (network == "ethTestnet") {
    await deployer.deploy(TokenEth);
    const tokenEth = await TokenEth.deployed();
    await tokenEth.mint(addresses[0], amount);
    await deployer.deploy(EthBridge, tokenEth.address);
    await tokenEth.updateAdmin(EthBridge.address);
  }
  if (network == "bscTestnet") {
    await deployer.deploy(TokenBsc);
    const tokenBsc = await TokenBsc.deployed();
    await tokenBsc.mint(addresses[0], amount);
    await deployer.deploy(BscBridge, tokenBsc.address);
    await tokenBsc.updateAdmin(BscBridge.address);
  }
};
