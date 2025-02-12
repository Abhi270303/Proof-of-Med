const fs = require("fs");
const { zkVerifySession, ZkVerifyEvents } = require("zkverifyjs");

(async () => {
    try {
        console.log("Starting zkVerify Proof Verification...");

        // Load the proof files generated in noir-circuits
        const proof = fs.readFileSync("../noir-circuits/proof.hex").toString();
        const publicSignals = fs.readFileSync("../noir-circuits/pub.hex").toString();
        const vk = fs.readFileSync("../noir-circuits/vk.hex").toString();

        // Start a zkVerify session (Ensure your account has $ACME tokens)
        const session = await zkVerifySession.start().Testnet().withAccount("hawk kidney episode finger biology news cloth capable cause code proof occur");

        console.log("Checking if verification key is already registered...");
        let vkey;

        try {
            vkey = require("./vkey.json");
            console.log("Verification Key already registered. Skipping registration.");
        } catch (err) {
            console.log("Registering verification key on zkVerify testnet...");
            const { events, regResult } = await session
                .registerVerificationKey()
                .ultraplonk()
                .execute(vk.split("\n")[0]);

            events.on(ZkVerifyEvents.Finalized, (eventData) => {
                console.log("Verification Key Registered:", eventData);
                fs.writeFileSync("vkey.json", JSON.stringify({ hash: eventData.statementHash }, null, 2));
            });

            // Wait for key registration to complete
            await new Promise((resolve) => setTimeout(resolve, 5000));

            console.log("Loading registered verification key...");
            vkey = require("./vkey.json");
        }

        // Submit the proof for verification
        console.log("Submitting proof for verification...");
        const { events: proofEvents, txResults } = await session
            .verify()
            .ultraplonk()
            .waitForPublishedAttestation()
            .withRegisteredVk()
            .execute({
                proofData: {
                    proof: proof.split("\n")[0],
                    vk: vkey.hash,
                    publicSignals: publicSignals.split("\n").slice(0, -1),
                },
            });

        // Listen for important verification events
        proofEvents.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
            console.log("Proof included in block:", eventData);
        });

        proofEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
            console.log("Proof verification finalized:", eventData);
        });

        // Save attestation proof when it's published
        proofEvents.on(ZkVerifyEvents.AttestationConfirmed, async (eventData) => {
            console.log("🔍 Attestation Confirmed:", eventData);
            const proofDetails = await session.poe(eventData.id, eventData.leafDigest);
            proofDetails.attestationId = eventData.id;
            fs.writeFileSync("attestation.json", JSON.stringify(proofDetails, null, 2));
            console.log("Attestation proof saved:", proofDetails);
        });

    } catch (error) {
        console.error("Error during proof verification:", error);
    }
})();
