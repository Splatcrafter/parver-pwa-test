package de.splatgames.software.external.afbb.parverpwatest.model;

public record PushMessage(
        String title,
        String body,
        String icon
) {
    public PushMessage {
        if (title == null || title.isBlank()) title = "PWA Showcase";
        if (body == null || body.isBlank()) body = "Dies ist eine Test-Benachrichtigung!";
        if (icon == null || icon.isBlank()) icon = "/icons/icon-192.png";
    }
}
