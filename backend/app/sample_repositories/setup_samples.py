import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FILES = {
    # 1. Banking Payment Gateway
    "banking-payment-gateway/src/auth_gateway.cpp": """// Core Banking Financial Transaction Gateway
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
""",

    "banking-payment-gateway/src/PaymentTransactionProcessor.java": """package com.securebank.core.payment;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Signature;
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

public class PaymentTransactionProcessor {

    public KeyPair generateMerchantKeys() throws Exception {
        // RSA KeyPair generation for high-value wire transfers
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        return kpg.generateKeyPair();
    }

    public byte[] signTransaction(KeyPair keyPair, byte[] transactionBytes) throws Exception {
        Signature signer = Signature.getInstance("SHA256withRSA");
        signer.initSign(keyPair.getPrivate());
        signer.update(transactionBytes);
        return signer.sign();
    }

    public byte[] encryptCreditCardPayload(SecretKey secretKey, byte[] iv, byte[] payload) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, spec);
        return cipher.doFinal(payload);
    }
}
""",

    "banking-payment-gateway/pom.xml": """<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.securebank.core</groupId>
  <artifactId>payment-gateway</artifactId>
  <version>3.5.0</version>
  <dependencies>
    <dependency>
      <groupId>org.bouncycastle</groupId>
      <artifactId>bcprov-jdk18on</artifactId>
      <version>1.77</version>
    </dependency>
    <dependency>
      <groupId>org.springframework.security</groupId>
      <artifactId>spring-security-crypto</artifactId>
      <version>6.2.1</version>
    </dependency>
  </dependencies>
</project>
""",

    "banking-payment-gateway/config/nginx_payment.conf": """# Banking Core Edge TLS Termination
server {
    listen 443 ssl http2;
    server_name api.securebank-core.com;

    ssl_certificate /etc/ssl/certs/gateway-cert.pem;
    ssl_certificate_key /etc/ssl/private/gateway-key.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;

    location /api/v1/payments {
        proxy_pass http://payment_backend;
    }
}
""",

    "banking-payment-gateway/Dockerfile": """FROM ubuntu:22.04
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y openssl libssl-dev ca-certificates build-essential
COPY ./certs/gateway-cert.pem /etc/ssl/certs/
WORKDIR /app
COPY . .
CMD ["./build/payment_gateway"]
""",

    # 2. Microservices Auth Service
    "microservices-auth-service/src/auth_jwt.py": """# Microservices Identity & OAuth2 Token Issuance
import hashlib
import os
from cryptography.hazmat.primitives.asymmetric import ec, rsa
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

class TokenSigner:
    def __init__(self):
        # ECDSA curve secp256r1 for token authentication
        self.ec_key = ec.generate_private_key(ec.SECP256R1())
        # RSA 2048 fallback key
        self.rsa_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

    def hash_password(self, password: str, salt: bytes) -> bytes:
        return hashlib.sha256(password.encode('utf-8') + salt).digest()

    def encrypt_session(self, session_key: bytes, plaintext: bytes) -> bytes:
        nonce = os.urandom(12)
        cipher = Cipher(algorithms.AES(session_key), modes.GCM(nonce))
        encryptor = cipher.encryptor()
        ciphertext = encryptor.update(plaintext) + encryptor.finalize()
        return nonce + encryptor.tag + ciphertext
""",

    "microservices-auth-service/src/pqc_preview.py": """# Post-Quantum Migration Prototype (NIST FIPS 203 & FIPS 204)
try:
    from pqcrypto.kem import kyber768
    from pqcrypto.sign import dilithium3
except ImportError:
    pass

def establish_quantum_safe_session():
    # ML-KEM-768 key encapsulation for post-quantum forward secrecy
    pk, sk = kyber768.generate_keypair()
    return pk, sk
""",

    "microservices-auth-service/src/tokenValidator.js": """// JavaScript Token Verification & Encryption
const crypto = require('crypto');

function signAccessToken(payload, privateKeyPem) {
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(JSON.stringify(payload));
    return signer.sign(privateKeyPem, 'base64');
}

function encryptInternalPayload(key, iv, data) {
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return { encrypted, tag };
}

function deriveKeyExchange() {
    const ecdh = crypto.createECDH('prime256v1');
    ecdh.generateKeys();
    return ecdh;
}

module.exports = { signAccessToken, encryptInternalPayload, deriveKeyExchange };
""",

    "microservices-auth-service/requirements.txt": """cryptography==41.0.7
pycryptodome==3.20.0
paramiko==3.4.0
pqcrypto==0.4.0
kyber-py==1.2.0
""",

    "microservices-auth-service/package.json": """{
  "name": "auth-identity-service",
  "version": "2.4.0",
  "dependencies": {
    "jsonwebtoken": "^9.0.2",
    "crypto-js": "^4.2.0",
    "node-forge": "^1.3.1",
    "bcrypt": "^5.1.1"
  }
}
""",

    # 3. Legacy Enterprise Portal
    "legacy-enterprise-portal/src/legacy_crypto.cpp": """// Legacy Enterprise Portal Crypto (High Technical Debt)
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
""",

    "legacy-enterprise-portal/src/LegacyAuth.java": """package com.legacy.portal;

import java.security.MessageDigest;
import javax.crypto.Cipher;
import javax.crypto.SecretKey;

public class LegacyAuth {
    public byte[] encryptWith3DES(SecretKey key, byte[] data) throws Exception {
        // Vulnerable 3DES encryption
        Cipher cipher = Cipher.getInstance("DESede/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, key);
        return cipher.doFinal(data);
    }

    public byte[] insecureMd5Hash(byte[] input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        return md.digest(input);
    }
}
""",

    "legacy-enterprise-portal/config/legacy_ssl.conf": """# Legacy Apache Insecure SSL Config
<VirtualHost *:443>
    ServerName legacy-portal.enterprise.internal
    SSLProtocol SSLv3 TLSv1 TLSv1.1 TLSv1.2
    SSLCipherSuite 3DES-CBC-SHA:RC4-MD5:AES128-SHA
    SSLCertificateFile /etc/ssl/certs/legacy.crt
</VirtualHost>
""",

    # 4. Cloud Native API
    "cloud-native-api/src/crypto_service.go": """package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/ecdh"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"io"
)

func GenerateRootSigner() (*rsa.PrivateKey, error) {
	// RSA 4096-bit root key
	return rsa.GenerateKey(rand.Reader, 4096)
}

func PerformHybridKeyExchange() ([]byte, error) {
	curve := ecdh.X25519()
	priv, err := curve.GenerateKey(rand.Reader)
	if err != nil {
		return nil, err
	}
	return priv.PublicKey().Bytes(), nil
}

func SealData(key []byte, plaintext []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}
	nonce := make([]byte, gcm.NonceSize())
	io.ReadFull(rand.Reader, nonce)
	return gcm.Seal(nonce, nonce, plaintext, nil), nil
}
""",

    "cloud-native-api/src/secure_vault.rs": """// Rust Cloud Native Microservice Cryptography
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
""",

    "cloud-native-api/go.mod": """module cloud-native-api

go 1.21

require (
	golang.org/x/crypto v0.21.0
	github.com/cloudflare/circl v1.3.7
)
""",

    "cloud-native-api/Cargo.toml": """[package]
name = "cloud-native-api"
version = "1.0.0"
edition = "2021"

[dependencies]
aes-gcm = "0.10.3"
ed25519-dalek = "2.1.1"
pqcrypto-kyber = "0.8.0"
pqcrypto-dilithium = "0.5.0"
""",

    "cloud-native-api/Dockerfile": """FROM golang:1.21-alpine
RUN apk add --no-cache openssl ca-certificates git
WORKDIR /app
COPY go.mod go.sum ./
COPY . .
RUN go build -o /server ./src/crypto_service.go
CMD ["/server"]
""",

    # 5. Clean Utility App (Zero Crypto Test for 0 False Positives)
    "clean-utility-app/src/string_utils.py": """# Pure text processing and math utility (No cryptography)
import json
import math
import re

def compute_compound_interest(principal: float, rate: float, time_years: int) -> float:
    return round(principal * math.pow((1 + rate / 100), time_years), 2)

def sanitize_username(username: str) -> str:
    cleaned = re.sub(r'[^a-zA-Z0-9_-]', '', username)
    return cleaned.strip().lower()

def format_summary_json(data: dict) -> str:
    return json.dumps(data, indent=2, sort_keys=True)
""",

    "clean-utility-app/src/calculator.js": """// Pure Mathematical and Array Utilities
function calculateMovingAverage(dataPoints, windowSize) {
    const results = [];
    for (let i = 0; i <= dataPoints.length - windowSize; i++) {
        const windowSlice = dataPoints.slice(i, i + windowSize);
        const sum = windowSlice.reduce((acc, val) => acc + val, 0);
        results.push(sum / windowSize);
    }
    return results;
}

function deepCloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports = { calculateMovingAverage, deepCloneObject };
""",

    "clean-utility-app/package.json": """{
  "name": "clean-utility-tools",
  "version": "1.0.0",
  "dependencies": {
    "lodash": "^4.17.21",
    "express": "^4.19.2",
    "moment": "^2.30.1"
  }
}
"""
}

def setup():
    for rel_path, content in FILES.items():
        full_path = os.path.join(BASE_DIR, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "w", encoding="utf-8") as f:
            f.write(content)
    print("All sample repositories populated successfully.")

if __name__ == "__main__":
    setup()
