import React from 'react';
import type { SessionChatMessage } from 'teleparty-websocket-lib';
import './Message.css';

interface MessageProps {
    message: SessionChatMessage;
    currentUserId: string;
}

export const Message: React.FC<MessageProps> = ({ message, currentUserId }) => {
    const isOwnMessage = message.permId === currentUserId;
    const isSystemMessage = message.isSystemMessage;

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isSystemMessage) {
        // Show nickname for system messages instead of ℹ️
        const nickname = message.userNickname || 'Someone';
        // Remove ℹ️ from the body if server includes it
        const bodyText = message.body.replace(/^ℹ️\s*/, '').trim();
        return (
            <div className="message-system">
                <span className="system-nickname">{nickname}</span>
                <span className="system-text">{bodyText}</span>
            </div>
        );
    }

    return (
        <div className={`message ${isOwnMessage ? 'message-own' : 'message-other'}`}>
            {!isOwnMessage && (
                <div className="message-avatar">
                    {message.userIcon ? (
                        <img src={`${message.userIcon}&name=${encodeURIComponent(message.userNickname || 'U')}`} alt="" />
                    ) : (
                        <div className="avatar-fallback">
                            {(message.userNickname || 'U').charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            )}
            <div className="message-content">
                {!isOwnMessage && (
                    <span className="message-nickname">{message.userNickname || 'Anonymous'}</span>
                )}
                <div className="message-bubble">
                    <p className="message-body">{message.body}</p>
                </div>
                <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
        </div>
    );
};
