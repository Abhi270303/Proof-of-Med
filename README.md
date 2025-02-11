## Proof of Med
![logo-color](https://github.com/armanthepythonguy/ZK-Med-CircuitBreaker/assets/66505181/a85b956e-18e8-4c2d-ab4c-f0b44b0c7461)


Online pharmacies have revolutionized the way people access medications, providing convenience and accessibility. However, ensuring the authenticity of medical prescriptions in online transactions remains a critical challenge. We utilize ZKPs to verify the authenticity of medical prescriptions in online pharmacy transactions, mitigating the risk of fraudulent prescriptions and enhancing trust between patients, doctors, and pharmacies.

Prescription Input Interface: Doctors input essential prescription details into our system. This includes patient information, medication details, dosage, and any other pertinent information required for the prescription.

Zero-Knowledge (ZK) with Noir: We construct a Zero-Knowledge Circuit using the Noir DSL, which serves as the basis for generating Zero-Knowledge Proofs. The circuit is designed to validate the integrity and authenticity of prescription data without disclosing sensitive information.

Zero-Knowledge Proof Generation: The Sindri proof market is utilized to generate Zero-Knowledge Proofs based on the input provided by the doctor. This offloads the computationally intensive task of proof generation from the client's machine to a specialized service, ensuring efficient processing and scalability.

Prescription Validation: Using the generated Zero-Knowledge Proof, the prescription data is securely validated by the pharmacy. This ensures that only legitimate prescriptions, verified through the ZK proof, are accepted for medication orders.

Order Fulfillment: Once the prescription is validated, the pharmacy proceeds with the medication order, dispensing only the medications prescribed by the doctor and verified through the ZK proof. This ensures adherence to the prescribed treatment plan and prevents unauthorized medication orders.

# Arbitrum Sepolia Contract Address
ZK-Med Core :- 0x2B6002EbDfa9c1DD4c8B1bAE809cE4eC90246A3C
