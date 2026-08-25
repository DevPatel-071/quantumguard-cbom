// Core Banking Financial Transaction Gateway
#include <iostream>
#include <openssl/rsa.h>
#include <openssl/pem.h>
#include <openssl/err.h>
#include <openssl/evp.h>
#include <openssl/sha.h>

void GenerateCustomerSigningKey() {
    // Generates 2048-bit RSA key for digital signatures
    RSA *rsa = RSA_new();
    BIGNUM *bn = BN_new();
    BN_set_word(bn, RSA_F4);
    
    // RSA Key Generation
    if (RSA_generate_key_ex(rsa, 2048, bn, NULL) != 1) {
        std::cerr << "Failed to generate RSA key" << std::endl;
    }
    
    BN_free(bn);
}

bool SignPaymentPayload(RSA* rsa_key, const unsigned char* msg, size_t msg_len, unsigned char* sig, unsigned int* sig_len) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256(msg, msg_len, hash);
    
    // Digital Signature on financial payload using RSA_sign
    return RSA_sign(NID_sha256, hash, SHA256_DIGEST_LENGTH, sig, sig_len, rsa_key) == 1;
}

void EncryptPaymentRecord(const unsigned char* plaintext, int len, unsigned char* key, unsigned char* iv, unsigned char* ciphertext) {
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();
    // High performance bulk encryption for banking records
    EVP_EncryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, key, iv);
    int out_len;
    EVP_EncryptUpdate(ctx, ciphertext, &out_len, plaintext, len);
    EVP_CIPHER_CTX_free(ctx);
}
