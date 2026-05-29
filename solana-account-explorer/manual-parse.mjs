import { getBase58Decoder } from "@solana/kit";

console.log("\n--- Manual Byte-Level Decode ---");

// Dataview lets you read ulti-byte values from a Unit8Array.
// The Token Mint account stores u32 and u64 values, so reading one byte at a time
// is not enough.
const view = new DataView(
    dataBytes.buffer,
    dataBytes.byteOffset,
    dataBytes.byteLength
);

const base58Decoder = getBase58Decoder();

const hasMintAuthority = view.getUint32(0, true) === 1;
console.log("Has Mint Authority:", hasMintAuthority);

if (hasMintAuthority) {
    const authorityBytes = dataBytes.slice(4, 36);
    console.log("Mint Authority:", base58Decoder.decode(authoorityBytes));
}

const supply = view.getBigUnit64(36, true);
console.log("Supply (raw):", supply.toString());

const decimals = view.getUint8(44);
console.log("Decimals:", decimals);

console.log(
    "Human-readable supply:", 
    Number(supply) / Math.pow(10, decimals)
);

const isInitialized = view.getUint8(45) === 1;
console.log("Is Initialized:", isInitialized);