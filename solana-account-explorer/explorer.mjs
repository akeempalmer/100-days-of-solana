import { createSolanaRpc, address} from "@solana/kit";

const RPC_URL = "https://api.devnet.solana.com";
const rpc = createSolanaRpc(RPC_URL);

// STEP 3
const inputAddress = process.argv[2];
if (!inputAddress) {
    console.error("Usage: node explorer.mjs <SOLANA_ADDRESS>");
    process.exit(1);
}

// STEP 4 
const targetAddress = address(inputAddress);

const { value: balanceLamports } = await rpc.getBalance(targetAddress).send();
const balanceSOL = Number(balanceLamports) / 1_000_000_000;

// STEP 5
const { value: accountInfo } = await rpc
    .getAccountInfo(targetAddress, {encoding: "base64"})
    .send();

// STEP 6
const KNOWN_PROGRAMS = {
  "11111111111111111111111111111111": "System Program",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "Token Program",
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb": "Token-2022 Program",
  "BPFLoaderUpgradeab1e11111111111111111111111": "BPF Upgradeable Loader",
};

function getOwnerLabel(ownerAddress) {
    return KNOWN_PROGRAMS[ownerAddress] || ownerAddress;
}

// STEP 7
console.log("\n=== Solana Account Explorer ===");
console.log(`Address: ${inputAddress} `);
console.log(`Balance: ${balanceSOL} SOL (${balanceLamports} lamports)`);

if (!accountInfo) {
    console.log(`Status: Account not found on-chain`);
} else {
    const owner = accountInfo.owner;
    const dataLength = accountInfo.data[0]
        ? Buffer.from(accountInfo.data[0], "base64").length
        : 0;
    
    console.log(`Owner: ${getOwnerLabel(owner)} (${owner})`);
    console.log(`Executable: ${accountInfo.executable}`);
    console.log(`Data size: ${dataLength} bytes`);
    console.log(`Rent Epoch: ${accountInfo.rentEpoch}`);

    if (dataLength > 0 && dataLength <= 128) {
        const raw = Buffer.from(accountInfo.data[0], "base64");
        console.log(`Data (hex): ${raw.toString("hex")}`);

    } else if (dataLength > 128) {
        const raw = Buffer.from(accountInfo.data[0], "base64");
        console.log(`Data (hex): ${raw.toString("hex").slice(0, 256)}... (truncated)`);
    }
}

console.log(
    `\nView on explorer: https://explorer.solana.com/address/${inputAddress}?cluster=devnet`
);