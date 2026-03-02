package de.splatgames.software.external.afbb.parverpwatest.config;

import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.interfaces.ECPrivateKey;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECNamedCurveParameterSpec;
import org.bouncycastle.jce.spec.ECPrivateKeySpec;
import org.bouncycastle.jce.spec.ECPublicKeySpec;
import org.bouncycastle.math.ec.ECPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigInteger;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.util.Base64;

@Configuration
public class WebPushConfig {

    private static final Logger log = LoggerFactory.getLogger(WebPushConfig.class);

    @Value("${vapid.public-key:}")
    private String vapidPublicKey;

    @Value("${vapid.private-key:}")
    private String vapidPrivateKey;

    @Value("${vapid.subject:mailto:demo@splatgames.de}")
    private String vapidSubject;

    private KeyPair vapidKeyPair;

    @Bean
    public PushService pushService() throws GeneralSecurityException {
        Security.addProvider(new BouncyCastleProvider());

        if (vapidPublicKey.isBlank() || vapidPrivateKey.isBlank()) {
            log.info("No VAPID keys configured - generating new keypair...");
            vapidKeyPair = generateKeyPair();

            ECPublicKey bcPublicKey = (ECPublicKey) vapidKeyPair.getPublic();
            byte[] publicKeyBytes = bcPublicKey.getQ().getEncoded(false);

            ECPrivateKey bcPrivateKey = (ECPrivateKey) vapidKeyPair.getPrivate();
            byte[] privateKeyBytes = toUnsignedByteArray(bcPrivateKey.getD().toByteArray(), 32);

            vapidPublicKey = Base64.getUrlEncoder().withoutPadding().encodeToString(publicKeyBytes);
            vapidPrivateKey = Base64.getUrlEncoder().withoutPadding().encodeToString(privateKeyBytes);

            log.info("Generated VAPID Public Key:  {}", vapidPublicKey);
            log.info("Generated VAPID Private Key: {}", vapidPrivateKey);
        } else {
            log.info("Using configured VAPID keys");
            vapidKeyPair = reconstructKeyPair(vapidPublicKey, vapidPrivateKey);
        }

        // Use KeyPair directly instead of string-based setPublicKey/setPrivateKey
        PushService pushService = new PushService(vapidKeyPair, vapidSubject);
        return pushService;
    }

    @Bean
    public String vapidPublicKeyString(PushService pushService) {
        return vapidPublicKey;
    }

    private KeyPair generateKeyPair() throws GeneralSecurityException {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC", "BC");
        keyGen.initialize(new ECGenParameterSpec("prime256v1"));
        return keyGen.generateKeyPair();
    }

    private KeyPair reconstructKeyPair(String publicKeyBase64, String privateKeyBase64) throws GeneralSecurityException {
        ECNamedCurveParameterSpec spec = ECNamedCurveTable.getParameterSpec("prime256v1");
        KeyFactory keyFactory = KeyFactory.getInstance("EC", "BC");

        // Reconstruct public key from raw uncompressed point
        byte[] publicKeyBytes = Base64.getUrlDecoder().decode(publicKeyBase64);
        ECPoint point = spec.getCurve().decodePoint(publicKeyBytes);
        ECPublicKeySpec pubSpec = new ECPublicKeySpec(point, spec);
        PublicKey publicKey = keyFactory.generatePublic(pubSpec);

        // Reconstruct private key from raw scalar
        byte[] privateKeyBytes = Base64.getUrlDecoder().decode(privateKeyBase64);
        BigInteger d = new BigInteger(1, privateKeyBytes);
        ECPrivateKeySpec privSpec = new ECPrivateKeySpec(d, spec);
        PrivateKey privateKey = keyFactory.generatePrivate(privSpec);

        return new KeyPair(publicKey, privateKey);
    }

    private byte[] toUnsignedByteArray(byte[] bytes, int length) {
        if (bytes.length == length) return bytes;
        byte[] result = new byte[length];
        if (bytes.length > length) {
            System.arraycopy(bytes, bytes.length - length, result, 0, length);
        } else {
            System.arraycopy(bytes, 0, result, length - bytes.length, bytes.length);
        }
        return result;
    }
}
