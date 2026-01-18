import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTeleparty } from '../context/TelepartyContext';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import './ChatRoom.css';

export const ChatRoom: React.FC = () => {
    const {
        sessionId,
        userId,
        nickname,
        messages,
        isAnyoneTyping,
        sendMessage,
        setTypingPresence,
        leaveRoom,
        error,
    } = useTeleparty();

    const [inputValue, setInputValue] = useState('');
    const [copied, setCopied] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);

        // Set typing presence
        setTypingPresence(true);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to clear typing presence after 2 seconds of no typing
        typingTimeoutRef.current = setTimeout(() => {
            setTypingPresence(false);
        }, 2000);
    }, [setTypingPresence]);

    const handleSendMessage = useCallback(() => {
        if (!inputValue.trim()) return;

        sendMessage(inputValue.trim());
        setInputValue('');
        setTypingPresence(false);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    }, [inputValue, sendMessage, setTypingPresence]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const copyRoomId = useCallback(() => {
        navigator.clipboard.writeText(sessionId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [sessionId]);

    return (
        <div className="chatroom-container">
            {/* Header */}
            <header className="chatroom-header">
                <div className="header-left">
                    <button onClick={leaveRoom} className="back-button" aria-label="Leave room">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="room-info">
                        <h1 className="room-title">Chat Room</h1>
                        <button onClick={copyRoomId} className="room-id-button">
                            <span className="room-id">{sessionId}</span>
                            <svg viewBox="0 0 24 24" fill="none" className="copy-icon">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {copied && <span className="copied-tooltip">Copied!</span>}
                        </button>
                    </div>
                </div>
                <div className="header-right">
                    <div className="user-badge">
                        <span className="user-icon">👤</span>
                        <span className="user-name">{nickname}</span>
                    </div>
                </div>
            </header>

            {/* Error Banner */}
            {error && (
                <div className="error-banner">
                    <span>{error}</span>
                </div>
            )}

            {/* Messages Area */}
            <main className="messages-container">
                {messages.length === 0 ? (
                    <div className="empty-messages">
                        <div className="empty-icon">💬</div>
                        <p>No messages yet</p>
                        <span>Be the first to say something!</span>
                    </div>
                ) : (
                    <div className="messages-list">
                        {messages.map((message, index) => (
                            <Message
                                key={`${message.timestamp}-${index}`}
                                message={message}
                                currentUserId={userId}
                            />
                        ))}
                        <TypingIndicator isVisible={isAnyoneTyping} />
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>

            {/* Input Area */}
            <footer className="input-container">
                <div className="input-wrapper">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        className="message-input"
                        maxLength={1000}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim()}
                        className="send-button"
                        aria-label="Send message"
                    >
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </footer>
        </div>
    );
};
