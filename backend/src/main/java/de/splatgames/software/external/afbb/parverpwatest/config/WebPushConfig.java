package de.splatgames.software.external.afbb.parverpwatest.config;

import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.ECNamedCurveTable;
import org.bouncycastle.jce.interfaces.ECPrivateKey;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.jce.spec.ECNamedCurveParameterSpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.GeneralSecurityException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.Security;
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

    @Bean
    public PushService pushService() throws GeneralSecurityException {
        Security.addProvider(new BouncyCastleProvider());

        if (vapidPublicKey.isBlank() || vapidPrivateKey.isBlank()) {
            log.info("No VAPID keys configured - generating new keypair...");
            KeyPair keyPair = generateKeyPair();

            // Extract raw uncompressed EC point (65 bytes) for public key
            ECPublicKey bcPublicKey = (ECPublicKey) keyPair.getPublic();
            byte[] publicKeyBytes = bcPublicKey.getQ().getEncoded(false);

            // Extract raw private key scalar (32 bytes)
            ECPrivateKey bcPrivateKey = (ECPrivateKey) keyPair.getPrivate();
            byte[] privateKeyBytes = toUnsignedByteArray(bcPrivateKey.getD().toByteArray(), 32);

            vapidPublicKey = Base64.getUrlEncoder().withoutPadding().encodeToString(publicKeyBytes);
            vapidPrivateKey = Base64.getUrlEncoder().withoutPadding().encodeToString(privateKeyBytes);

            log.info("Generated VAPID Public Key:  {}", vapidPublicKey);
            log.info("Generated VAPID Private Key: {}", vapidPrivateKey);
            log.info("Set these as environment variables VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to persist them.");
        }

        PushService pushService = new PushService();
        pushService.setPublicKey(vapidPublicKey);
        pushService.setPrivateKey(vapidPrivateKey);
        pushService.setSubject(vapidSubject);
        return pushService;
    }

    @Bean
    public String vapidPublicKeyString() {
        return vapidPublicKey;
    }

    private KeyPair generateKeyPair() throws GeneralSecurityException {
        ECNamedCurveParameterSpec paramSpec = ECNamedCurveTable.getParameterSpec("prime256v1");
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC", "BC");
        keyGen.initialize(new ECGenParameterSpec("prime256v1"));
        return keyGen.generateKeyPair();
    }

    private byte[] toUnsignedByteArray(byte[] bytes, int length) {
        // BigInteger.toByteArray() may have a leading zero byte for sign
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
