const axios = (await import("axios")).default;

// Use v1 of the Sindri API.
const baseURL = "https://sindri.app/api/v1";
const SINDRI_API_KEY = "";

// Create axios instance with default config
const sindriClient = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${SINDRI_API_KEY}`,
    "Content-Type": "application/json",
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

export async function getProof(
  client_add,
  doc_add,
  med_details,
  use_once,
  freq,
  med_hash,
  detail_hash,
  hashed_msg,
  pub_x,
  pub_y,
  sign
) {
  // Pad med_details array to length 10 with zeros
  const paddedMedDetails = [...med_details];
  while (paddedMedDetails.length < 10) {
    paddedMedDetails.push(0);
  }

  const proofInput = `doc_address = "${doc_add}"
  client_address = "${client_add}"
  use_once = ${use_once}
  freq = ${freq}
  med_details = [${paddedMedDetails}]
  med_hash = "${med_hash}"
  detail_hash = "${detail_hash}"
  hashed_message = [${hashed_msg}]
  pub_key_x_solver = [${pub_x}]
  pub_key_y_solver = [${pub_y}]
  signature_solver = [${sign}]`;

  console.log("Proof Input:", proofInput);

  try {
    const proveResponse = await axios.post(
      `https://sindri.app/api/v1/circuit/8d17476d-25a6-488b-b7e9-109b63f1af78/prove`,
      {
        proof_input: proofInput,
      },
      {
        headers: {
          Authorization: `Bearer ${SINDRI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("proveResponse", proveResponse.data);

    const proofId = proveResponse.data.proof_id;
    console.log("Proof ID:", proofId);

    let startTime = Date.now();
    let proofDetailResponse;

    while (true) {
      proofDetailResponse = await axios.get(
        `https://sindri.app/api/v1/proof/${proofId}/detail`,
        {
          headers: {
            Authorization: `Bearer ${SINDRI_API_KEY}`,
          },
        }
      );

      const { status } = proofDetailResponse.data;
      const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

      if (status === "Ready") {
        console.log(`Polling succeeded after ${elapsedSeconds} seconds.`);
        break;
      } else if (status === "Failed") {
        throw new Error(
          `Polling failed after ${elapsedSeconds} seconds: ${proofDetailResponse.data.error}.`
        );
      } else if (Date.now() - startTime > 30 * 60 * 1000) {
        throw new Error("Timed out after 30 minutes.");
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(proofDetailResponse.data.public, "public");
    return proofDetailResponse.data.proof["proof"];
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
}

export function padHash(hash) {
  let newHash = "0x";
  for (let i = 0; i < 64 - hash.length; i++) {
    newHash += "0";
  }
  return newHash + hash;
}

// export function padHash(hash) {
//   let newHash = "0x";
//   for (let i = 0; i < 64 - hash.length; i++) {
//     newHash += "0";
//   }
//   return newHash + hash;
// }
