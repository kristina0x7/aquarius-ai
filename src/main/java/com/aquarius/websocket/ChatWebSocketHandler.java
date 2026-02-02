package com.aquarius.websocket;

import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.aquarius.OpenAIService;
import java.util.Map;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    private OpenAIService openAIService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("✅ New WebSocket connection: " + session.getId());

        session.sendMessage(new TextMessage(
                mapper.writeValueAsString(Map.of(
                        "type", "system",
                        "message", "Connected to Aquarius AI",
                        "timestamp", System.currentTimeMillis()
                ))
        ));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Map<String, String> data = mapper.readValue(message.getPayload(), Map.class);
        String userMessage = data.get("message");

        if (userMessage == null || userMessage.trim().isEmpty()) {
            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(Map.of(
                            "type", "error",
                            "message", "Message cannot be empty"
                    ))
            ));
            return;
        }

        session.sendMessage(new TextMessage(
                mapper.writeValueAsString(Map.of(
                        "type", "user",
                        "message", userMessage,
                        "timestamp", System.currentTimeMillis()
                ))
        ));

        session.sendMessage(new TextMessage(
                mapper.writeValueAsString(Map.of(
                        "type", "typing",
                        "status", true
                ))
        ));

        try {
            String aiResponse = openAIService.sendMessage(userMessage);

            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(Map.of(
                            "type", "assistant",
                            "message", aiResponse,
                            "timestamp", System.currentTimeMillis()
                    ))
            ));
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(Map.of(
                            "type", "error",
                            "message", "Error: " + e.getMessage()
                    ))
            ));
        } finally {
            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(Map.of(
                            "type", "typing",
                            "status", false
                    ))
            ));
        }
    }
}