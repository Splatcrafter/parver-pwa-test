package de.splatgames.software.external.afbb.parverpwatest.config;

import nl.martijndwars.webpush.PushService;
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

    @Bean
    public PushService pushService() throws GeneralSecurityException {
        Security.addProvider(new BouncyCastleProvider());

        if (vapidPublicKey.isBlank() || vapidPrivateKey.isBlank()) {
            log.info("No VAPID keys configured - generating new keypair...");
            KeyPair keyPair = generateKeyPair();
            vapidPublicKey = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(keyPair.getPublic().getEncoded());
            vapidPrivateKey = Base64.getUrlEncoder().withoutPadding()
                    .encodeToString(keyPair.getPrivate().getEncoded());
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
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC", "BC");
        keyGen.initialize(new ECGenParameterSpec("prime256v1"));
        return keyGen.generateKeyPair();
    }
}
