package com.aquarius;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.json.JSONObject;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAIService {

    @Value("${ai.openai.api-key}")
    private String openAiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final OkHttpClient client = new OkHttpClient();

    public String sendMessage(String message) {
        try {
            List<Map<String, String>> messages = new ArrayList<>();
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", message);
            messages.add(userMessage);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "gpt-4o-mini");
            requestBody.put("messages", messages);
            requestBody.put("max_tokens", 1000);
            requestBody.put("temperature", 0.7);

            String jsonBody = objectMapper.writeValueAsString(requestBody);

            RequestBody body = RequestBody.create(
                    jsonBody,
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url("https://api.openai.com/v1/chat/completions")
                    .post(body)
                    .addHeader("Authorization", "Bearer " + openAiKey)
                    .addHeader("Content-Type", "application/json")
                    .build();

            Response response = client.newCall(request).execute();

            if (!response.isSuccessful()) {
                String errorBody = response.body() != null ? response.body().string() : "No error body";
                System.err.println("OpenAI API error: " + response.code() + " - " + errorBody);
                return "Error from OpenAI: HTTP " + response.code();
            }

            String jsonResponse = response.body().string();
            JSONObject obj = new JSONObject(jsonResponse);

            if (obj.has("choices") && obj.getJSONArray("choices").length() > 0) {
                JSONObject messageObj = obj.getJSONArray("choices")
                        .getJSONObject(0)
                        .getJSONObject("message");
                return messageObj.getString("content").trim();
            } else {
                return "No response from AI";
            }

        } catch (Exception e) {
            e.printStackTrace();
            return "Exception: " + e.getMessage();
        }
    }
}