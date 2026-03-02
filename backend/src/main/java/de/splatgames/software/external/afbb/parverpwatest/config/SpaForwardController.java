package de.splatgames.software.external.afbb.parverpwatest.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController {

    @RequestMapping(value = {"/", "/{path:^(?!api|assets|icons|sw\\.js|manifest\\.webmanifest|workbox-).*$}/**"})
    public String forward() {
        return "forward:/index.html";
    }
}
