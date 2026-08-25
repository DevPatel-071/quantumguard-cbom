// Rust Cloud Native Microservice Cryptography
use aes_gcm::{Aes256Gcm, Key, Nonce};
use aes_gcm::aead::{Aead, KeyInit};
use ed25519_dalek::SigningKey;
use rand::rngs::OsRng;

pub fn generate_signing_identity() -> SigningKey {
    let mut csprng = OsRng;
    SigningKey::generate(&mut csprng)
}

pub fn encrypt_vault_payload(key_bytes: &[u8; 32], nonce_bytes: &[u8; 12], data: &[u8]) -> Vec<u8> {
    let key = Key::<Aes256Gcm>::from_slice(key_bytes);
    let cipher = Aes256Gcm::new(key);
    let nonce = Nonce::from_slice(nonce_bytes);
    cipher.encrypt(nonce, data).expect("encryption failure")
}
