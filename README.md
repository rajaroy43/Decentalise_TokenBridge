# TokenBridge

#   D e c e n t r a l i s e T o k e n B r i d g e 
 

Token bridge between ethereum and binance smart chain (Transferring 1Token from ethereum to binance smart chain) By sending user signature to other blockchain.

Add infura_id in truffle-config.js also in ./scripts/eth_bsc_bridge.js . Add private key in ./scripts/eth_bsc_bridge.js .

Add private key in ./scripts/eth-bsc-transfer.js for signing message

Run following command -

1."truffle compile " -It will build artifcats in ./build/contracts. Deploy token and bridge to both blockchain

truffle migrate --network ethTestnet
truffle migrate --network bscTestnet
Now run scripts: run "node .\scripts\eth-bsc-bridge.js " (It will listen all 1event emitted at Ethereum Blockchain) then transfer some eth tokens (run transfer script "truffle exec .\scripts\eth-bsc-transfer.js --network ethTestnet".

After running truffle exec .\scripts\eth-bsc-transfer.js --network ethTestnet and it will get succeded then even will be emitted and then some tokens will b eminting on BinanceSmartChain
