package com.campus.carbontracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> rootHealthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ONLINE");
        response.put("service", "Smart Campus Carbon Footprint & Energy Tracker REST API");
        response.put("swaggerUI", "/swagger-ui.html");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
}
