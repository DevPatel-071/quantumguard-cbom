// Legacy Enterprise Portal Crypto (High Technical Debt)
#include <openssl/des.h>
#include <openssl/md5.h>
#include <openssl/sha.h>
#include <openssl/rsa.h>

void LegacyDataEncryption(const unsigned char* input, unsigned char* output, des_key_schedule* ks1, des_key_schedule* ks2) {
    // 3DES (DESede) deprecated encryption
    DES_cblock iv = {0};
    DES_ede3_cbc_encrypt(input, output, 64, ks1, ks2, ks1, &iv, DES_ENCRYPT);
}

void HashOldCredentials(const unsigned char* pwd, unsigned long len, unsigned char* out) {
    // Deprecated MD5 and SHA-1 hashing
    MD5(pwd, len, out);
    SHA1(pwd, len, out + 16);
}

void GenerateWeakRSA() {
    RSA* rsa = RSA_new();
    BIGNUM* e = BN_new();
    BN_set_word(e, 65537);
    // Legacy 1024-bit RSA key
    RSA_generate_key_ex(rsa, 1024, e, NULL);
}
