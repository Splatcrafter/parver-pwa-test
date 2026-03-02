package de.splatgames.software.external.afbb.parverpwatest.config;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaForwardController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        // Forward 404s to index.html for SPA routing, let other errors pass
        Object status = request.getAttribute("jakarta.servlet.error.status_code");
        if (status != null && (int) status == 404) {
            return "forward:/index.html";
        }
        return "forward:/index.html";
    }
}
