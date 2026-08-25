package com.legacy.portal;

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
