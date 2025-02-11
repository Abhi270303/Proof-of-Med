use dep::std;

fn main(
    doc_address: pub Field,
    client_address: Field,
    use_once: Field,
    freq: Field,
    med_details: [Field; 10],
    med_hash: pub Field,
    detail_hash: pub Field,
    hashed_message: [u8; 32],
    pub_key_x_solver: [u8; 32],
    pub_key_y_solver: [u8; 32],
    signature_solver: [u8; 64]
){
    let test_detail_hash = std::hash::poseidon::bn254::hash_4([doc_address, client_address, use_once, freq]);
    assert(test_detail_hash == detail_hash);
    let test_med_hash = std::hash::poseidon::bn254::hash_10(med_details);
    assert(test_med_hash == med_hash);
    let valid_signature = std::ecdsa_secp256k1::verify_signature(
        pub_key_x_solver,
        pub_key_y_solver,
        signature_solver,
        hashed_message,
    );
    assert(valid_signature);
}

