import {generateKeyPairSigner, createSolanaRpc, devnet, address} from "@solana/kit"

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));

// Generate a brand new keypaid
const wallet = await generateKeyPairSigner();

console.log("Your new wallet address: ", wallet.address);
console.log("\n- Go to https://faucet.solana.com/ and airdrop SOL to this address -");
console.log(
    "- Then run this script again with the same address to check the balance -\n"
);

// To check a specific address you've already funded, replace the line below:
const {value: balance } = await rpc.getBalance(address("2DMz9JZowNTJg6NknHqF8RKcUpXUmxhg9NmQqztmW1vF")).send();

// const { value: balance } = await rpc.getBalance(wallet.address).send();
const balanceInSol = Number(balance) / 1_000_000_000;

console.log(`Balance: ${balanceInSol} SOL`);
