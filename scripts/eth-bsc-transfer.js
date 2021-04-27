const EthBridge = artifacts.require("./EthBridge.sol");

module.exports = async (done) => {
  const [recipient, _] = await web3.eth.getAccounts();
  const bridgeEth = await EthBridge.deployed();
  console.log("Transferring some eth token to  Binance chain ....");
  try {
    const nonce = 3;
    const amount = 10000000000000;
    const message = web3.utils
      .soliditySha3({ t: "address", v: recipient }, { t: "address", v: recipient }, { t: "uint256", v: amount }, { t: "uint256", v: nonce })
      .toString("hex");
    const privateKey = "a11ab8b453d1f35612fd573b266590a9825719c6015a7c3ee6fcea4cf66d70e7";
    const { signature } = web3.eth.accounts.sign(message, privateKey);
    await bridgeEth.burn(recipient, amount, signature, nonce);
    console.log("Transferred");
  } catch (error) {
    console.log("Transferred error", error);
  }
  done();
};
