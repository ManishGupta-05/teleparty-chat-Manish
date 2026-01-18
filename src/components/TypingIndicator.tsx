import React from 'react';
import './TypingIndicator.css';

interface TypingIndicatorProps {
    isVisible: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="typing-indicator">
            <div className="typing-dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
            <span className="typing-text">Someone is typing...</span>
        </div>
    );
};
