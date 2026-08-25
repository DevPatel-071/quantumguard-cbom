package com.securebank.core.payment;

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
