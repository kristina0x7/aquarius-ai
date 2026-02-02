package com.aquarius;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private OpenAIService openAIService;

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
                "app", "🌊 AQUARIUS AI",
                "status", "RUNNING",
                "version", "1.0.0",
                "timestamp", LocalDateTime.now(),
                "message", "Welcome to Aquarius AI!",
                "endpoints", Map.of(
                        "/api/status", "System status",
                        "/api/hello", "Simple hello",
                        "/actuator/health", "Health check",
                        "/api/test-keys", "Check if AI keys are loaded"
                )
        );
    }

    @GetMapping("/test-keys")
    public Map<String, String> testKeys() {
        boolean openAiConfigured = openAIService != null;
        return Map.of(
                "openai_configured", openAiConfigured ? "✅" : "❌",
                "service", "Aquarius AI",
                "note", "API keys are configured via environment variables"
        );
    }


    @GetMapping("/status")
    public Map<String, String> status() {
        return Map.of(
                "status", "✅ ONLINE",
                "service", "Aquarius AI Engine",
                "java", System.getProperty("java.version"),
                "spring", "3.2.7",
                "ai_provider", "OpenAI GPT-4o-mini"
        );
    }

    @GetMapping("/hello")
    public String hello() {
        return "🚀 Hello from Aquarius AI! Spring Boot is running!";
    }
}