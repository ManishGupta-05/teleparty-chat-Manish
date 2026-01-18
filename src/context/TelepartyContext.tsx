import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { TelepartyClient, SocketMessageTypes } from 'teleparty-websocket-lib';
import type { SocketEventHandler, SessionChatMessage } from 'teleparty-websocket-lib';

// Local types
type ConnectionState = 'disconnected' | 'connecting' | 'connected';
type ViewState = 'home' | 'chat';

interface TypingMessageData {
    anyoneTyping: boolean;
    usersTyping: string[];
}

interface TelepartyContextValue {
    // Connection state
    connectionState: ConnectionState;
    isConnected: boolean;

    // Session state
    sessionId: string;
    userId: string;
    nickname: string;

    // View state
    view: ViewState;

    // Messages
    messages: SessionChatMessage[];

    // Typing state
    isAnyoneTyping: boolean;
    usersTyping: string[];

    // Actions
    setNickname: (nickname: string) => void;
    createRoom: (nickname: string) => Promise<void>;
    joinRoom: (roomId: string, nickname: string) => Promise<void>;
    sendMessage: (message: string) => void;
    setTypingPresence: (typing: boolean) => void;
    leaveRoom: () => void;

    // Error state
    error: string | null;
    clearError: () => void;
}

const TelepartyContext = createContext<TelepartyContextValue | null>(null);

export const useTeleparty = () => {
    const context = useContext(TelepartyContext);
    if (!context) {
        throw new Error('useTeleparty must be used within a TelepartyProvider');
    }
    return context;
};

interface TelepartyProviderProps {
    children: React.ReactNode;
}

export const TelepartyProvider: React.FC<TelepartyProviderProps> = ({ children }) => {
    const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
    const [sessionId, setSessionId] = useState<string>('');
    const [userId] = useState<string>('');
    const [nickname, setNicknameState] = useState<string>('');
    const [view, setView] = useState<ViewState>('home');
    const [messages, setMessages] = useState<SessionChatMessage[]>([]);
    const [isAnyoneTyping, setIsAnyoneTyping] = useState(false);
    const [usersTyping, setUsersTyping] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const clientRef = useRef<TelepartyClient | null>(null);

    // Initialize client on mount
    useEffect(() => {
        const eventHandler: SocketEventHandler = {
            onConnectionReady: () => {
                console.log('Connection ready');
                setConnectionState('connected');
            },
            onClose: () => {
                console.log('Connection closed');
                setConnectionState('disconnected');
                setError('Connection lost. Please refresh the page to reconnect.');
            },
            onMessage: (message) => {
                console.log('Received message:', message);

                // Handle different message types
                if (message.type === SocketMessageTypes.SEND_MESSAGE) {
                    const chatMessage = message.data as SessionChatMessage;
                    setMessages(prev => [...prev, chatMessage]);
                } else if (message.type === SocketMessageTypes.SET_TYPING_PRESENCE) {
                    const typingData = message.data as TypingMessageData;
                    setIsAnyoneTyping(typingData.anyoneTyping);
                    setUsersTyping(typingData.usersTyping || []);
                }
            },
        };

        try {
            const client = new TelepartyClient(eventHandler);
            clientRef.current = client;
            setConnectionState('connecting');
        } catch (err) {
            console.error('Failed to initialize client:', err);
            setError('Failed to connect to server');
        }

        return () => {
            // Cleanup if needed
        };
    }, []);

    const setNickname = useCallback((name: string) => {
        setNicknameState(name);
    }, []);

    const generateUserIcon = (): string => {
        const colors = ['4f46e5', '7c3aed', 'db2777', 'ea580c', '16a34a', '0891b2'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `https://ui-avatars.com/api/?background=${color}&color=fff&bold=true`;
    };

    const createRoom = useCallback(async (name: string) => {
        if (!clientRef.current) {
            setError('Not connected to server');
            return;
        }

        try {
            setError(null);
            setNicknameState(name);
            const userIcon = generateUserIcon();
            const roomId = await clientRef.current.createChatRoom(name, userIcon);
            console.log('Created room:', roomId);
            setSessionId(roomId);
            setView('chat');
        } catch (err) {
            console.error('Failed to create room:', err);
            setError(err instanceof Error ? err.message : 'Failed to create room');
        }
    }, []);

    const joinRoom = useCallback(async (roomId: string, name: string) => {
        if (!clientRef.current) {
            setError('Not connected to server');
            return;
        }

        try {
            setError(null);
            setNicknameState(name);
            const userIcon = generateUserIcon();
            const result = await clientRef.current.joinChatRoom(name, roomId, userIcon);
            console.log('Joined room, result:', result);

            // If result contains previous messages, add them
            if (result && result.messages) {
                setMessages(result.messages);
            }

            setSessionId(roomId);
            setView('chat');
        } catch (err) {
            console.error('Failed to join room:', err);
            setError(err instanceof Error ? err.message : 'Failed to join room');
        }
    }, []);

    const sendMessage = useCallback((message: string) => {
        if (!clientRef.current || !message.trim()) return;

        clientRef.current.sendMessage(SocketMessageTypes.SEND_MESSAGE, {
            body: message.trim()
        });
    }, []);

    const setTypingPresence = useCallback((typing: boolean) => {
        if (!clientRef.current) return;

        clientRef.current.sendMessage(SocketMessageTypes.SET_TYPING_PRESENCE, {
            typing: typing
        });
    }, []);

    const leaveRoom = useCallback(() => {
        setView('home');
        setSessionId('');
        setMessages([]);
        setIsAnyoneTyping(false);
        setUsersTyping([]);
        // Refresh the page to reset connection
        window.location.reload();
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const value: TelepartyContextValue = {
        connectionState,
        isConnected: connectionState === 'connected',
        sessionId,
        userId,
        nickname,
        view,
        messages,
        isAnyoneTyping,
        usersTyping,
        setNickname,
        createRoom,
        joinRoom,
        sendMessage,
        setTypingPresence,
        leaveRoom,
        error,
        clearError,
    };

    return (
        <TelepartyContext.Provider value={value}>
            {children}
        </TelepartyContext.Provider>
    );
};
