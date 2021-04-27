const EthBridge = artifacts.require("./EthBridge.sol");

module.exports = async (done) => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeEth = await EthBridge.deployed();
  console.log("Transferring some eth token to  Binance chain ....");
  try {
    const amount = 10000000000000;
    const nonce = parseInt(await bridgeEth.userNonce(recipient)) + 1;
    const message = web3.utils
      .soliditySha3({ t: "address", v: recipient }, { t: "address", v: recipient }, { t: "uint256", v: amount }, { t: "uint256", v: nonce })
      .toString("hex");
    const privateKey = "Private_Key";
    const { signature } = web3.eth.accounts.sign(message, privateKey);
    await bridgeEth.burn(recipient, amount, signature);
    console.log("Transferred");
  } catch (error) {
    console.log("Transferred error", error);
  }
  done();
};
