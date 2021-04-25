const BscBridge = artifacts.require("./BscBridge.sol");

module.exports = async (done) => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeBsc = await BscBridge.deployed();
  console.log("Transferring some eth token to  Binance chain");
  const tx = await bridgeBsc.burn(recipient, 1000000000000000000n);
  done();
};
