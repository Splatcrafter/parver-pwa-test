package de.splatgames.software.external.afbb.parverpwatest.model;

public record PushSubscription(
        String endpoint,
        Long expirationTime,
        Keys keys
) {
    public record Keys(String p256dh, String auth) {}
}
