const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { zkVerifySession, ZkVerifyEvents } = require("zkverifyjs");
const app = express();
const port = 8000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const vk = fs.readFileSync("vk.hex").toString();

// POST endpoint to handle proof verification
app.post("/verify", async (req, res) => {
  const { proof, publicSignals } = req.body;
  const session = await zkVerifySession
    .start()
    .Testnet()
    .withAccount(
      "hawk kidney episode finger biology news cloth capable cause code proof occur"
    );

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
      fs.writeFileSync(
        "vkey.json",
        JSON.stringify({ hash: eventData.statementHash }, null, 2)
      );
    });

    // Wait for key registration to complete
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Loading registered verification key...");
    vkey = require("./vkey.json");
  }

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
        publicSignals: publicSignals.split("\n").slice(0),
      },
    });

  proofEvents.on(ZkVerifyEvents.IncludedInBlock, (eventData) => {
    console.log("Proof included in block:", eventData);
  });

  // Set up other event listeners for logging
  let leafDigest, txHash;

  proofEvents.on(ZkVerifyEvents.Finalized, (eventData) => {
    console.log("Proof verification finalized:", eventData);
    leafDigest = eventData.leafDigest;
    txHash = eventData.txHash;
    console.log("leadDigest", leafDigest);
  });

  const blockPromise = new Promise((resolve) => {
    proofEvents.on(ZkVerifyEvents.AttestationConfirmed, async (eventData) => {
      console.log("leadDigest", leafDigest);
      console.log("🔍 Attestation Confirmed:", eventData);
      const proofDetails = await session.poe(eventData.id, leafDigest);
      proofDetails.attestationId = eventData.id;
      fs.writeFileSync(
        "attestation.json",
        JSON.stringify(proofDetails, null, 2)
      );
      resolve({ txHash: txHash, ...proofDetails });
      console.log("Attestation proof saved:", proofDetails);
    });
  });

  try {
    // Wait for the block inclusion and return the hash immediately
    const result = await blockPromise;
    res.json(result);
  } catch (error) {
    console.error("Error during proof verification:", error);
    res.status(500).json({ error: "Proof verification failed" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
