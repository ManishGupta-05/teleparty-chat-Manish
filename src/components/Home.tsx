import React, { useState } from 'react';
import { useTeleparty } from '../context/TelepartyContext';
import './Home.css';

export const Home: React.FC = () => {
    const { isConnected, connectionState, createRoom, joinRoom, error, clearError } = useTeleparty();
    const [nickname, setNickname] = useState('');
    const [roomId, setRoomId] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const handleCreateRoom = async () => {
        if (!nickname.trim()) {
            alert('Please enter a nickname');
            return;
        }

        setIsCreating(true);
        try {
            await createRoom(nickname);
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinRoom = async () => {
        if (!nickname.trim()) {
            alert('Please enter a nickname');
            return;
        }
        if (!roomId.trim()) {
            alert('Please enter a room ID');
            return;
        }

        setIsJoining(true);
        try {
            await joinRoom(roomId, nickname);
        } finally {
            setIsJoining(false);
        }
    };

    const getConnectionStatusClass = () => {
        switch (connectionState) {
            case 'connected':
                return 'status-connected';
            case 'connecting':
                return 'status-connecting';
            default:
                return 'status-disconnected';
        }
    };

    const getConnectionStatusText = () => {
        switch (connectionState) {
            case 'connected':
                return 'Connected';
            case 'connecting':
                return 'Connecting...';
            default:
                return 'Disconnected';
        }
    };

    return (
        <div className="home-container">
            <div className="home-card">
                {/* Header */}
                <div className="home-header">
                    <div className="logo-container">
                        <div className="logo-icon">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <h1 className="logo-text">Teleparty Chat</h1>
                    </div>
                    <p className="home-subtitle">Connect with friends in real-time</p>

                    {/* Connection Status */}
                    <div className={`connection-status ${getConnectionStatusClass()}`}>
                        <span className="status-dot"></span>
                        <span className="status-text">{getConnectionStatusText()}</span>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        <span>{error}</span>
                        <button onClick={clearError} className="error-close">×</button>
                    </div>
                )}

                {/* Nickname Input */}
                <div className="input-section">
                    <label htmlFor="nickname" className="input-label">Your Nickname</label>
                    <input
                        id="nickname"
                        type="text"
                        placeholder="Enter your nickname..."
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="input-field"
                        maxLength={30}
                    />
                </div>

                {/* Divider */}
                <div className="section-divider">
                    <span>Choose an option</span>
                </div>

                {/* Create Room Section */}
                <div className="action-section">
                    <button
                        onClick={handleCreateRoom}
                        disabled={!isConnected || isCreating}
                        className="btn btn-primary"
                    >
                        {isCreating ? (
                            <>
                                <span className="spinner"></span>
                                Creating...
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" className="btn-icon">
                                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Create New Room
                            </>
                        )}
                    </button>
                </div>

                {/* OR Divider */}
                <div className="or-divider">
                    <span>OR</span>
                </div>

                {/* Join Room Section */}
                <div className="action-section">
                    <label htmlFor="roomId" className="input-label">Room ID</label>
                    <div className="join-input-group">
                        <input
                            id="roomId"
                            type="text"
                            placeholder="Enter room ID to join..."
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                            className="input-field"
                        />
                        <button
                            onClick={handleJoinRoom}
                            disabled={!isConnected || isJoining}
                            className="btn btn-secondary"
                        >
                            {isJoining ? (
                                <>
                                    <span className="spinner"></span>
                                    Joining...
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" className="btn-icon">
                                        <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Join
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="home-footer">
                    <p>Create a room and share the ID with friends to start chatting!</p>
                </div>
            </div>
        </div>
    );
};
