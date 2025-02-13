const express = require("express");
const { exec } = require("child_process");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 8001;

app.use(express.json());

async function writeProverConfig(
  doc_address,
  client_address,
  use_once,
  freq,
  med_details,
  med_hash,
  detail_hash,
  hashed_message,
  pub_key_x_solver,
  pub_key_y_solver,
  signature_solver
) {
  const content = `doc_address = "${doc_address}"
  client_address = "${client_address}"
  use_once = ${use_once}
  freq = ${freq}
  med_details = [${med_details}]
  med_hash = "${med_hash}"
  detail_hash = "${detail_hash}"
  hashed_message = [${hashed_message}]
  pub_key_x_solver = [${pub_key_x_solver}]
  pub_key_y_solver = [${pub_key_y_solver}]
  signature_solver = [${signature_solver}]`;

  const filePath = path.join(__dirname, "../noir-circuits/Prover.toml");

  try {
    await fs.writeFile(filePath, content);
    console.log("Successfully wrote Prover.toml");
    return true;
  } catch (error) {
    console.error("Error writing Prover.toml:", error);
    return false;
  }
}

// Function to ensure directory exists
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Enhanced command execution with timeout
function executeCommand(command, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(
      command,
      {
        timeout: timeout,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing ${command}:`, error);
          reject(error);
          return;
        }
        if (stderr) {
          console.warn(`Warning for ${command}:`, stderr);
        }
        console.log(`Output of ${command}:`, stdout);
        resolve(stdout);
      }
    );

    childProcess.on("error", (error) => {
      console.error(`Process error for ${command}:`, error);
      reject(error);
    });
  });
}

app.post("/generate-proof", async (req, res) => {
  const {
    doc_address,
    client_address,
    use_once,
    freq,
    med_details,
    med_hash,
    detail_hash,
    hashed_message,
    pub_key_x_solver,
    pub_key_y_solver,
    signature_solver,
  } = req.body;

  try {
    // Write Prover.toml file
    console.log("Writing Prover.toml...");
    const success = await writeProverConfig(
      doc_address,
      client_address,
      use_once,
      freq,
      med_details,
      med_hash,
      detail_hash,
      hashed_message,
      pub_key_x_solver,
      pub_key_y_solver,
      signature_solver
    );
    // Change to the noir-circuits directory
    const noirCircuitsPath = path.join(__dirname, "../noir-circuits");
    process.chdir(noirCircuitsPath);

    console.log("Starting proof generation process...");

    // Create proofs directory
    await ensureDir("../proofs");

    // Execute commands sequentially
    console.log("Executing nargo...");
    await executeCommand("nargo execute", 60000);

    console.log("Generating proof...");
    await executeCommand(
      "bb prove -b ./target/zk_med.json -w ./target/zk_med.gz -o ./target/proof",
      120000
    );

    console.log("Writing verification key...");
    await executeCommand(
      "bb write_vk -b ./target/zk_med.json -o ./target/vk",
      60000
    );

    console.log("Verifying proof...");
    await executeCommand("bb verify -k ./target/vk -p ./target/proof", 60000);

    // Change to ultraplonk_verifier directory and process proof
    console.log("Processing proof data...");
    await executeCommand(
      "cd ultraplonk_verifier && noir-cli proof-data -n 3 --input-proof ../target/proof --output-proof ../proofs/zkv_proof.json --output-pubs ../proofs/zkv_pubs.json",
      60000
    );

    // Add a small delay to ensure file system sync
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Read the proof files
    console.log("Reading proof files...");
    const zkProofPath = path.join(
      "..",
      "noir-circuits",
      "proofs",
      "zkv_proof.hex"
    );
    const zkPubsPath = path.join(
      "..",
      "noir-circuits",
      "proofs",
      "zkv_pubs.hex"
    );

    const [proofContent, pubsContent] = await Promise.all([
      fs.readFile(zkProofPath, "utf8").catch(() => ""),
      fs.readFile(zkPubsPath, "utf8").catch(() => ""),
    ]);

    console.log("Process completed successfully");

    res.json({
      success: true,
      proof_file: {
        path: "../proofs/zkv_proof.hex",
        content: proofContent.trim(),
      },
      pubs_file: {
        path: "../proofs/zkv_pubs.hex",
        content: pubsContent.trim(),
      },
    });
  } catch (error) {
    console.error("Error in generate-proof:", error);
    res.status(500).json({
      success: false,
      error: error.message || "An error occurred during proof generation",
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
