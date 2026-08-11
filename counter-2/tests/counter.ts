import * as anchor from "@anchor-lang/core";
import { Program } from "@anchor-lang/core";
import { Counter2 } from "../target/types/counter_2";
import { PublicKey, Keypair, LAMPORTS_PER_SOL, } from "@solana/web3.js";
import { assert } from "chai";

// describe("counter", () => {
//     const provider = anchor.AnchorProvider.env();
//     anchor.setProvider(provider);

//     const program = anchor.workspace.Counter2 as Program<Counter2>;

//     const counterPda = (user: PublicKey) => 
//         PublicKey.findProgramAddressSync(
//             [Buffer.from("counter"), user.toBuffer()],
//             program.programId
//         )[0];

//         it("creates a counter per user and increments independently", async () => {
//             const alice = provider.wallet.publicKey;
//             const bob = Keypair.generate();

//             // fund bob so he can pay rent
//             const sig = await provider.connection.requestAirdrop(
//                 bob.publicKey,
//                 2 * LAMPORTS_PER_SOL
//             );

//             const latest = await provider.connection.getLatestBlockhash();
//             await provider.connection.confirmTransaction({
//                 signature: sig, ...latest
//             }, "confirmed");

//             await program.methods
//                 .initCounter()
//                 .accounts({user: alice})
//                 .rpc();

//             await program.methods
//                 .initCounter()
//                 .accounts({user: bob.publicKey})
//                 .signers([bob])
//                 .rpc();

//             await program.methods.increment().accounts({user: alice}).rpc();
//             await program.methods.increment().accounts({user: alice}).rpc();
//             await program.methods.increment().accounts({user: bob.publicKey}).signers([bob]).rpc();

//             const aliceState = await program.account.counter.fetch(counterPda(alice));
//             const bobState = await program.account.counter.fetch(counterPda(bob.publicKey));

//             assert.equal(aliceState.count.toNumber(), 2);
//             assert.equal(bobState.count.toNumber(), 1);
//             assert.ok(aliceState.user.equals(alice));
//             assert.ok(bobState.user.equals(bob.publicKey));
//         });
// });


describe("counter with config", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Counter2 as Program<Counter2>;
    const admin = provider.wallet;

    const [configPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("config")],
        program.programId
    );

    const [counterPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("counter"), admin.publicKey.toBuffer()],
        program.programId
    )

    it("initializes config and a counter, then increments", async () => {
        await program.methods.initConfig().rpc();
        await program.methods.initCounter().rpc();
        await program.methods.increment().rpc();

        const counter = await program.account.counter.fetch(counterPda);
        assert.equal(counter.count.toNumber(), 1);
    });

    it("refuses to increment when paused", async () => {
        await program.methods.setPaused(true).rpc();
        try {
            await program.methods.increment().rpc();
            assert.fail("expected pause error");
        } catch (err: any) {
            assert.include(err.toString(), "Paused");
        } 
        await program.methods.setPaused(false).rpc();
    });
});