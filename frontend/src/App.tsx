import React, { useState, useEffect, useRef } from 'react';

function App() {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! I am Aquarius AI. How can I help you today?', sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws/chat');

        socket.onopen = () => {
            console.log('✅ WebSocket connected to Aquarius AI');
            setConnected(true);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log('Received from backend:', data);

                if (data.type === 'assistant') {
                    setMessages(prev => [...prev, {
                        id: Date.now(),
                        text: data.message,
                        sender: 'ai'
                    }]);
                } else if (data.type === 'system') {
                    console.log('System message:', data.message);
                }
            } catch (error) {
                console.error('Error parsing message:', error);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setConnected(false);
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
            setConnected(false);
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!input.trim() || !ws || !connected) return;

        setMessages(prev => [...prev, {
            id: Date.now(),
            text: input,
            sender: 'user'
        }]);

        ws.send(JSON.stringify({ message: input }));
        setInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a14 0%, #1a1a2e 100%)',
            color: 'white',
            padding: '20px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px 20px',
                    marginBottom: '30px'
                }}>
                    <h1 style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #00f3ff, #9d00ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '10px'
                    }}>
                        🌊 AQUARIUS AI
                    </h1>
                    <p style={{
                        color: '#00f3ff',
                        fontSize: '14px',
                        letterSpacing: '3px',
                        textTransform: 'uppercase'
                    }}>
                        Neural Interface
                    </p>

                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '20px',
                        padding: '10px 20px',
                        background: connected ? 'rgba(0, 255, 157, 0.1)' : 'rgba(255, 68, 68, 0.1)',
                        borderRadius: '50px',
                        border: `1px solid ${connected ? '#00ff9d' : '#ff4444'}`
                    }}>
                        <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: connected ? '#00ff9d' : '#ff4444',
                            animation: connected ? 'pulse 2s infinite' : 'none'
                        }} />
                        <span style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            fontFamily: 'monospace'
                        }}>
              {connected ? 'NEURAL LINK ACTIVE' : 'LINK DISRUPTED'}
            </span>
                    </div>
                </div>

                {/* Chat Container */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '20px',
                    padding: '30px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 243, 255, 0.1)',
                    boxShadow: '0 0 40px rgba(0, 243, 255, 0.1)',
                    marginBottom: '30px'
                }}>
                    {/* Messages */}
                    <div style={{
                        height: '400px',
                        overflowY: 'auto',
                        marginBottom: '20px',
                        paddingRight: '10px'
                    }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    marginBottom: '15px',
                                    display: 'flex',
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    maxWidth: '70%',
                                    padding: '15px 20px',
                                    borderRadius: '20px',
                                    background: msg.sender === 'user'
                                        ? 'linear-gradient(135deg, #00f3ff, #0077ff)'
                                        : msg.sender === 'ai'
                                            ? 'rgba(157, 0, 255, 0.15)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                    border: msg.sender === 'ai' ? '1px solid rgba(157, 0, 255, 0.3)' : 'none',
                                    wordBreak: 'break-word'
                                }}>
                                    <div style={{
                                        fontSize: '12px',
                                        opacity: 0.7,
                                        marginBottom: '5px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px'
                                    }}>
                                        {msg.sender === 'user' ? '🧠 YOU' : msg.sender === 'ai' ? '🤖 AQUARIUS' : '⚡ SYSTEM'}
                                    </div>
                                    <div>{msg.text}</div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={connected ? "Enter your neural query..." : "Connecting to backend..."}
                            style={{
                                flex: 1,
                                padding: '18px 25px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '2px solid rgba(0, 243, 255, 0.3)',
                                borderRadius: '15px',
                                color: 'white',
                                fontSize: '16px',
                                outline: 'none',
                                transition: 'all 0.3s'
                            }}
                            disabled={!connected}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || !connected}
                            style={{
                                padding: '18px 35px',
                                background: 'linear-gradient(135deg, #00f3ff, #9d00ff)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '15px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: connected ? 'pointer' : 'not-allowed',
                                opacity: connected ? 1 : 0.5,
                                transition: 'all 0.3s',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            TRANSMIT
                        </button>
                    </div>

                    {/* Status Bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '20px',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontFamily: 'monospace'
                    }}>
                        <div>
                            PORT: 8080 • PROTOCOL: WS • ENCRYPTION: ACTIVE
                        </div>
                        <div>
                            PRESS <kbd style={{
                            padding: '2px 8px',
                            background: 'rgba(0, 243, 255, 0.2)',
                            borderRadius: '4px',
                            margin: '0 5px'
                        }}>ENTER</kbd> TO SEND
                        </div>
                    </div>
                </div>

                {/* Info Panel */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginTop: '30px'
                }}>
                    <div style={{
                        background: 'rgba(0, 243, 255, 0.05)',
                        padding: '20px',
                        borderRadius: '15px',
                        border: '1px solid rgba(0, 243, 255, 0.1)'
                    }}>
                        <h3 style={{ color: '#00f3ff', marginBottom: '10px' }}>🌐 CONNECTION</h3>
                        <p style={{ fontSize: '14px', opacity: 0.8 }}>WebSocket to Spring Boot backend with real-time updates</p>
                    </div>

                    <div style={{
                        background: 'rgba(157, 0, 255, 0.05)',
                        padding: '20px',
                        borderRadius: '15px',
                        border: '1px solid rgba(157, 0, 255, 0.1)'
                    }}>
                        <h3 style={{ color: '#9d00ff', marginBottom: '10px' }}>🤖 AI ENGINE</h3>
                        <p style={{ fontSize: '14px', opacity: 0.8 }}>Powered by OpenAI GPT-4o-mini with neural processing</p>
                    </div>

                    <div style={{
                        background: 'rgba(0, 255, 157, 0.05)',
                        padding: '20px',
                        borderRadius: '15px',
                        border: '1px solid rgba(0, 255, 157, 0.1)'
                    }}>
                        <h3 style={{ color: '#00ff9d', marginBottom: '10px' }}>⚡ PERFORMANCE</h3>
                        <p style={{ fontSize: '14px', opacity: 0.8 }}>Low-latency responses with typing indicators</p>
                    </div>
                </div>
            </div>

            {/* Add pulse animation */}
            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #00f3ff, #9d00ff);
          border-radius: 4px;
        }
      `}</style>
        </div>
    );
}

export default App;