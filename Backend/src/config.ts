import { createTestClient, http, publicActions, walletActions, createWalletClient, custom } from 'viem'
import { foundry } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts';
 
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

const account = privateKeyToAccount(privateKey);


export const client = createTestClient({
  chain: foundry,
  mode: 'anvil',
  transport: http("http://127.0.0.1:8545"), 
})
.extend(publicActions)
.extend(walletActions)

export const walletClient = createWalletClient({
    account, 
    chain: foundry,
    transport: http('http://127.0.0.1:8545'),
})
   
//   // JSON-RPC Account
// export const [account] = await walletClient.getAddresses()
//   // Local Account
// export const account = privateKeyToAccount(...)