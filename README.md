# Proof of Med

## Overview
**Proof of Med** is a decentralized solution that ensures the authenticity of medical prescriptions in online pharmacy transactions using **Zero-Knowledge Proofs (ZKPs)**. By leveraging **Noir for circuit design**, **Noir Ultraplonk for proof generation**, **zkVerify for on-chain verification**, and **Arbitrum Sepolia for blockchain execution**, Proof of Med provides a trustless system that mitigates fraudulent prescriptions while maintaining patient privacy.

## **Key Features**
- **Privacy-Preserving Prescription Verification**: Validates prescriptions without exposing sensitive patient data.
- **Decentralized & Secure**: Uses **Arbitrum Sepolia** for verifiable and immutable prescription records.
- **Scalable Proof Generation**: Utilizes **Noir Ultraplonk's proof ** to intensive ZKP generation.
- **Seamless Integration for Pharmacies**: Ensures only legitimate prescriptions are fulfilled, preventing unauthorized medication orders.

## **Technical Stack**
| Component               | Technology |
|------------------------|------------|
| **ZK Circuit Design**  | Noir |
| **Proof Generation**   | Noir Ultraplonk |
| **Proof Verification** | zkVerify Attestation |
| **Smart Contract**     | Solidity (Arbitrum Sepolia) |
| **Frontend**           | Next.js, Ethers.js |

## Contract Information
- **Network:** Arbitrum Sepolia
- **Contract Address:** `0x2B6002EbDfa9c1DD4c8B1bAE809cE4eC90246A3C`

## How It Works
1. **Prescription Input**
   - Doctors input prescription details, including patient information, medication name, dosage, and other relevant details.

2. **ZK Circuit Execution**
   - A **Noir-based ZK circuit** is used to validate the prescription’s integrity without revealing private patient data.

3. **Proof Generation**
   - **Noir Ultraplonk** generates a ZK proof for the prescription data, ensuring scalability and efficiency in the verification process.

4. **On-Chain Proof Verification**
   - The ZK proof is submitted to **ZKVerify**, which checks the proof’s validity before allowing the prescription to proceed.

5. **Order Fulfillment**
   - Once verified, the pharmacy processes the order, ensuring that only legitimate prescriptions lead to medication dispensing.

## Smart Contract Roles
- **Owner** – Administers the contract and assigns roles.
- **Doctor** – Authorized to issue prescriptions.
- **Pharmacy** – Manages inventory and fulfills orders based on verified prescriptions.


## Future Roadmap
- **Integration with IPFS** for prescription storage.
- **Onboarding real-world pharmacies** for pilot testing.
- **Enhancing ZK circuit efficiency** for faster proof generation.

## **Contributors**
- **[Abhishek Yadav]** - Developer & Architect

## License
MIT License

---
🚀 **Proof of Med brings security, privacy, and decentralization to online prescriptions.**


