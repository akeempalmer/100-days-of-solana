import * as anchor from "@anchor-lang/core";
import type { Counter2 } from "../target/types/counter_2.ts";

(async ()=> {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.Counter2 as anchor.Program<Counter2>;
    await program.methods.initConfig().rpc();
    console.log("config initialized");
})();