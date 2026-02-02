package com.aquarius;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final OpenAIService openAIService;

    @Autowired
    public ChatController(OpenAIService openAIService) {
        this.openAIService = openAIService;
    }

    @PostMapping("/openai")
    public Map<String, String> chatOpenAI(@RequestBody Map<String, String> payload) {
        String prompt = payload.get("prompt");
        String response = openAIService.sendMessage(prompt);
        return Map.of(
                "prompt", prompt,
                "response", response
        );
    }

    @GetMapping("/env")
    public Map<String, String> checkEnv() {
        return Map.of(
                "service", "Aquarius AI",
                "status", "active",
                "ai_provider", "OpenAI",
                "note", "API keys are configured via environment variables"
        );
    }


    @PostMapping("/message")
    public Map<String, String> sendMessage(@RequestBody Map<String, String> payload) {
        String userMessage = payload.get("message");
        if (userMessage == null || userMessage.isEmpty()) {
            return Map.of("error", "Message is empty");
        }

        String aiResponse = openAIService.sendMessage(userMessage);
        return Map.of(
                "user", userMessage,
                "ai", aiResponse
        );
    }
}