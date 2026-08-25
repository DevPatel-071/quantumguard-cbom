# Microservices Identity & OAuth2 Token Issuance
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
