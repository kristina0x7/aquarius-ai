# Aquarius AI

### Spring Boot + OpenAI Integration

A fully functional AI chatbot API built with Spring Boot that integrates with OpenAI's GPT API.

## Features
- AI-Powered Chat with OpenAI GPT-4o-mini(Currently)
- Multi-language Support
- Spring Boot 3.2.7 with auto-configuration
- Secure API key management via environment variables

## Quick Start
1. Set your OpenAI API key: `export OPENAI_API_KEY="your-key"`
2. Run: `mvn spring-boot:run`
3. Test: `curl http://localhost:8080/api/`

## API Endpoints
- `POST /api/chat/openai` - Chat with AI
- `POST /api/chat/message` - Alternative chat endpoint
- `GET /api/status` - System status
- `GET /api/hello` - Simple greeting

## Tech Stack
- Java 21 + Spring Boot 3.2.7
- OpenAI GPT-4o-mini API
- OkHttp for HTTP requests
- Jackson for JSON processing
- Maven for dependency management
