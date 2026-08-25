// JavaScript Token Verification & Encryption
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
