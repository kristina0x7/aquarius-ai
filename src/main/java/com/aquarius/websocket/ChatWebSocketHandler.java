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
        System.out.println("New WebSocket connection: " + session.getId());

        session.sendMessage(new TextMessage(
                mapper.writeValueAsString(Map.of(
                        "type", "system",
                        "message", "Connected to Aquarius AI! Ask me anything.",
                        "timestamp", System.currentTimeMillis()
                ))
        ));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        Map<String, String> data = mapper.readValue(payload, Map.class);
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

        System.out.println("📨 Received message: " + userMessage);

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

            System.out.println("AI Response: " + aiResponse.substring(0, Math.min(100, aiResponse.length())) + "...");

            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(Map.of(
                            "type", "assistant",
                            "message", aiResponse,
                            "timestamp", System.currentTimeMillis()
                    ))
            ));

        } catch (Exception e) {
            System.err.println("Error getting AI response: " + e.getMessage());
            session.sendMessage(new TextMessage(
                    mapper.writeValueAsString(Map.of(
                            "type", "error",
                            "message", "Sorry, I encountered an error: " + e.getMessage()
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

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("WebSocket error: " + exception.getMessage());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("WebSocket disconnected: " + session.getId());
    }
}