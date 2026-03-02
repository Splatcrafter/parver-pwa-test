package de.splatgames.software.external.afbb.parverpwatest.config;

import nl.martijndwars.webpush.PushService;
import org.bouncycastle.jce.interfaces.ECPrivateKey;
import org.bouncycastle.jce.interfaces.ECPublicKey;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
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

    private void ensureKeysGenerated() throws GeneralSecurityException {
        if (vapidPublicKey.isBlank() || vapidPrivateKey.isBlank()) {
            Security.addProvider(new BouncyCastleProvider());
            log.info("No VAPID keys configured - generating new keypair...");
            KeyPair keyPair = generateKeyPair();

            ECPublicKey bcPublicKey = (ECPublicKey) keyPair.getPublic();
            byte[] publicKeyBytes = bcPublicKey.getQ().getEncoded(false);

            ECPrivateKey bcPrivateKey = (ECPrivateKey) keyPair.getPrivate();
            byte[] privateKeyBytes = toUnsignedByteArray(bcPrivateKey.getD().toByteArray(), 32);

            vapidPublicKey = Base64.getUrlEncoder().withoutPadding().encodeToString(publicKeyBytes);
            vapidPrivateKey = Base64.getUrlEncoder().withoutPadding().encodeToString(privateKeyBytes);

            log.info("Generated VAPID Public Key:  {}", vapidPublicKey);
            log.info("Generated VAPID Private Key: {}", vapidPrivateKey);
            log.info("Set these as environment variables VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to persist them.");
        } else {
            Security.addProvider(new BouncyCastleProvider());
        }
    }

    @Bean
    public PushService pushService() throws GeneralSecurityException {
        ensureKeysGenerated();

        PushService pushService = new PushService();
        pushService.setPublicKey(vapidPublicKey);
        pushService.setPrivateKey(vapidPrivateKey);
        pushService.setSubject(vapidSubject);
        return pushService;
    }

    @Bean
    public String vapidPublicKeyString(PushService pushService) {
        // Dependency on pushService ensures keys are generated first
        return vapidPublicKey;
    }

    private KeyPair generateKeyPair() throws GeneralSecurityException {
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC", "BC");
        keyGen.initialize(new ECGenParameterSpec("prime256v1"));
        return keyGen.generateKeyPair();
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
