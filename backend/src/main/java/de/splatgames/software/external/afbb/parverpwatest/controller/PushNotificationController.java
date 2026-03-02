package de.splatgames.software.external.afbb.parverpwatest.controller;

import de.splatgames.software.external.afbb.parverpwatest.model.PushMessage;
import de.splatgames.software.external.afbb.parverpwatest.model.PushSubscription;
import de.splatgames.software.external.afbb.parverpwatest.service.PushNotificationService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/push")
public class PushNotificationController {

    private final PushNotificationService pushNotificationService;
    private final String vapidPublicKey;

    public PushNotificationController(
            PushNotificationService pushNotificationService,
            @Qualifier("vapidPublicKeyString") String vapidPublicKey
    ) {
        this.pushNotificationService = pushNotificationService;
        this.vapidPublicKey = vapidPublicKey;
    }

    @GetMapping("/public-key")
    public ResponseEntity<Map<String, String>> getPublicKey() {
        return ResponseEntity.ok(Map.of("publicKey", vapidPublicKey));
    }

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, String>> subscribe(@RequestBody PushSubscription subscription) {
        pushNotificationService.subscribe(subscription);
        return ResponseEntity.ok(Map.of("message", "Subscription erfolgreich gespeichert"));
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<Map<String, String>> unsubscribe(@RequestBody Map<String, String> body) {
        pushNotificationService.unsubscribe(body.get("endpoint"));
        return ResponseEntity.ok(Map.of("message", "Subscription entfernt"));
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendNotification(@RequestBody(required = false) PushMessage message) {
        if (message == null) {
            message = new PushMessage(null, null, null);
        }
        int sent = pushNotificationService.sendToAll(message);
        return ResponseEntity.ok(Map.of(
                "message", "Push-Benachrichtigung gesendet",
                "sent", sent
        ));
    }

    @GetMapping("/subscription-count")
    public ResponseEntity<Map<String, Integer>> getSubscriptionCount() {
        return ResponseEntity.ok(Map.of("count", pushNotificationService.getSubscriptionCount()));
    }
}
