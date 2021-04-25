const EthBridge = artifacts.require("./EthBridge.sol");

module.exports = async (done) => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeEth = await EthBridge.deployed();
  console.log("Transferring some eth token to  Binance chain");
  try {
    await bridgeEth.burn(recipient, 1000000000000000000n);
    console.log("Trasnferred success");
  } catch (error) {
    console.log("Transferred error");
  }
  done();
};
