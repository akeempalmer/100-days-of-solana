import {PublicKey} from "@solana/web3.js";

const programId = new PublicKey("FUvn7bNyfwB3FiFi7XZLVzqrhhUzuBoQpdFgJoeCV7uv");

const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    programId
);

console.log("Seeds: [\"counter\"]");
console.log("Program ID: ", programId.toBase58());
console.log("PDA: ", pda.toBase58());
console.log("Canonical bump: ", bump);
