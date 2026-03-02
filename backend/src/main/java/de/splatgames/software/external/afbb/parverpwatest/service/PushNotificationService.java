package de.splatgames.software.external.afbb.parverpwatest.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.splatgames.software.external.afbb.parverpwatest.model.PushMessage;
import de.splatgames.software.external.afbb.parverpwatest.model.PushSubscription;
import nl.martijndwars.webpush.Encoding;
import nl.martijndwars.webpush.Notification;
import nl.martijndwars.webpush.PushService;
import org.apache.http.HttpResponse;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class PushNotificationService {

    private static final Logger log = LoggerFactory.getLogger(PushNotificationService.class);

    private final PushService pushService;
    private final ObjectMapper objectMapper;
    private final ConcurrentHashMap<String, PushSubscription> subscriptions = new ConcurrentHashMap<>();

    public PushNotificationService(PushService pushService, ObjectMapper objectMapper) {
        this.pushService = pushService;
        this.objectMapper = objectMapper;
    }

    public void subscribe(PushSubscription subscription) {
        subscriptions.put(subscription.endpoint(), subscription);
        log.info("New push subscription registered. Total: {}", subscriptions.size());
    }

    public void unsubscribe(String endpoint) {
        subscriptions.remove(endpoint);
        log.info("Push subscription removed. Total: {}", subscriptions.size());
    }

    public int sendToAll(PushMessage message) {
        int sent = 0;
        for (PushSubscription sub : subscriptions.values()) {
            try {
                String payload = objectMapper.writeValueAsString(message);
                Notification notification = new Notification(
                        sub.endpoint(),
                        sub.keys().p256dh(),
                        sub.keys().auth(),
                        payload.getBytes()
                );
                HttpResponse response = pushService.send(notification, Encoding.AES128GCM);
                int statusCode = response.getStatusLine().getStatusCode();
                String responseBody = response.getEntity() != null
                        ? EntityUtils.toString(response.getEntity())
                        : "";

                if (statusCode == 201) {
                    sent++;
                    log.info("Push sent successfully to endpoint: ...{}", sub.endpoint().substring(sub.endpoint().length() - 30));
                } else {
                    log.error("Push failed with status {}: {} | Endpoint: ...{}", statusCode, responseBody, sub.endpoint().substring(sub.endpoint().length() - 30));
                    if (statusCode == 404 || statusCode == 410) {
                        subscriptions.remove(sub.endpoint());
                        log.info("Removed expired subscription");
                    }
                }
            } catch (Exception e) {
                log.error("Exception sending push to {}: {}", sub.endpoint(), e.getMessage(), e);
                subscriptions.remove(sub.endpoint());
            }
        }
        log.info("Push result: {}/{} successful", sent, subscriptions.size() + (subscriptions.size() - sent));
        return sent;
    }

    public int getSubscriptionCount() {
        return subscriptions.size();
    }
}
