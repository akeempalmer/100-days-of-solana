Generate a keypair and get devnet SOL
The Scenario
Arc theme: Identity and your first wallet

Web2 bridge: Think of a Solana keypair like an SSH key pair: you generate it locally, the public half identifies you, and the private half proves you are who you claim to be.

Before you can do anything on Solana, you need an identity. On most platforms, identity means an email and password stored on someone else's server. On Solana, identity is a keypair: a public key (your address, visible to everyone) and a private key (your secret, held only by you). No server in the middle. You prove who you are by signing transactions with your private key, and anyone can verify that signature using your public key.

Today you're going to create your first keypair and fund it with test SOL so you can start writing to the network.

The Challenge
Generate a new Solana keypair programmatically. Then fund it with devnet SOL using the Solana faucet.

What You'll Need
A project folder with @solana/kit installed
A terminal
A code editor
A web browser (for the faucet)
Steps
In your project folder, create a new file called create-wallet.mjs:

import { generateKeyPairSigner } from "@solana/kit";
// Generate a brand new keypair
const wallet = await generateKeyPairSigner();

console.log(“Your new wallet address:”, wallet.address);
console.log(
“\nThis address is your public key. It’s safe to share.”
);
console.log(
“The private key stays in memory. In a real app, you’d save it securely.”
);

Run It
node create-wallet.mjs
You'll see a new Solana address printed to your terminal. Every time you run this script, you'll get a different address because it generates a fresh keypair each time.

Copy the address from your terminal output. Go to faucet.solana.com, make sure "Devnet" is selected, paste your address, and request an airdrop. The faucet will send free test SOL to your new address.

Now verify the funds arrived. Update your script to check the balance after funding:

import { generateKeyPairSigner, createSolanaRpc, devnet, } from "@solana/kit";
const rpc = createSolanaRpc(devnet(“https://api.devnet.solana.com”));
const wallet = await generateKeyPairSigner();

console.log(“Wallet address:”, wallet.address);
console.log(“\n— Go to https://faucet.solana.com/ and airdrop SOL to this address —”);
console.log(“— Then run this script again with the same address to check the balance —\n”);

// To check a specific address you’ve already funded, replace the line below:
// const { value: balance } = await rpc.getBalance(address(“YOUR_ADDRESS_HERE”)).send();
const { value: balance } = await rpc.getBalance(wallet.address).send();
const balanceInSol = Number(balance) / 1_000_000_000;

console.log(Balance: ${balanceInSol} SOL);

Note: since generateKeyPairSigner() creates a new keypair every time, the second run will show a fresh, unfunded wallet. To check the balance of the address you already funded, import address from @solana/kit and replace wallet.address with address("YOUR_FUNDED_ADDRESS") in the getBalance call. We'll solve this persistence problem on Day 2.

What Just Happened
You created a Solana keypair. That's a pair of cryptographic keys: a public key (your address) and a private key (your proof of identity). Together, they're all you need to interact with Solana. No email, no password, no account creation on a server.

A few things to notice:

The keypair was generated entirely on your machine. No network call was needed. The address is derived mathematically from the private key using the Ed25519 algorithm. This means you can create a Solana wallet offline, disconnected from the internet, and it's immediately valid on any Solana network.

The web faucet gave you free test SOL. Devnet SOL has no monetary value. It exists purely for developers to experiment without risk. You'll use it for the rest of this program whenever you need to pay for transactions on devnet.

The private key in this script lives only in memory and disappears when the script exits. In a real application, you'd need to store it somewhere safe. Browser wallets like Phantom handle this for you. We'll get to that on Day 4.

Resources
Solana faucet
Kit signers guide
Solana keypairs and wallets
