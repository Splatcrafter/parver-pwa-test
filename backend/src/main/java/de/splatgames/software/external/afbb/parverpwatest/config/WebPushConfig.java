package de.splatgames.software.external.afbb.parverpwatest.config;

import nl.martijndwars.webpush.PushService;
import nl.martijndwars.webpush.Utils;
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

    @Value("${vapid.subject:mailto:demo@splatgames.de}")
    private String vapidSubject;

    private String vapidPublicKeyBase64;

    @Bean
    public PushService pushService() throws GeneralSecurityException {
        Security.addProvider(new BouncyCastleProvider());

        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC", "BC");
        keyGen.initialize(new ECGenParameterSpec("prime256v1"));
        KeyPair keyPair = keyGen.generateKeyPair();

        // Use the library's own Utils.encode() to get the raw public key bytes
        byte[] rawPublicKey = Utils.encode((ECPublicKey) keyPair.getPublic());
        vapidPublicKeyBase64 = Base64.getUrlEncoder().withoutPadding().encodeToString(rawPublicKey);

        log.info("VAPID Public Key: {}", vapidPublicKeyBase64);
        log.info("VAPID Public Key length (bytes): {}", rawPublicKey.length);

        // Verify the key can be loaded back by the library
        try {
            Utils.loadPublicKey(vapidPublicKeyBase64);
            log.info("VAPID key verification: OK");
        } catch (Exception e) {
            log.error("VAPID key verification FAILED: {}", e.getMessage());
        }

        PushService pushService = new PushService(keyPair, vapidSubject);
        return pushService;
    }

    @Bean
    public String vapidPublicKeyString(PushService pushService) {
        return vapidPublicKeyBase64;
    }
}
