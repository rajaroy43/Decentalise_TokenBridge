const Web3 = require("web3");
const EthBridge = require("../build/contracts/EthBridge.json");
const BscBridge = require("../build/contracts/BscBridge.json");
const web3Eth = new Web3("wss://kovan.infura.io/ws/v3/INFURA_ID");
const web3Bsc = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545");
const adminPrivKey = "PRIVATE_KEY";
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);
const Ethbridge = new web3Eth.eth.Contract(EthBridge.abi, EthBridge.networks["42"].address);

const Bscbridge = new web3Bsc.eth.Contract(BscBridge.abi, BscBridge.networks["97"].address);
Ethbridge.events.Transfer({ fromBlock: 0, step: 0 }).on("data", async (event) => {
  const { from, to, ammount, date, nonceOfEthereumChain } = event.returnValues;
  const alreadyProcessed = await Bscbridge.methods.processedNonces(nonceOfEthereumChain).call();
  if (!alreadyProcessed) {
    const tx = await Bscbridge.methods.mint(to, ammount, nonceOfEthereumChain);
    const [gasPrice, gasCost] = await Promise.all([web3Bsc.eth.getGasPrice(), tx.estimateGas({ from: admin })]);
    const data = tx.encodeABI();
    const txData = {
      from: admin,
      to: Bscbridge.options.address,
      data,
      gas: gasCost,
      gasPrice,
    };
    const receipt = await web3Bsc.eth
      .sendTransaction(txData)
      .on("transactionHash", function (hash) {
        console.log("transactionHash is here ", hash);
      })
      .on("receipt", function (receipt) {
        console.log("recipte is here ");
        console.log(receipt);
      });
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`
    Processed transfer:
    - from ${from} 
    - to ${to} 
    - amount ${ammount} tokens
    - date ${date}
  `);
  }
});
