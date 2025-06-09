import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

function Chat({ userId }) {
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [recipientId, setRecipientId] = useState('');
    const [chatStarted, setChatStarted] = useState(false);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const stompClientRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-game');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            console.log('✅ WebSocket для чата подключен, userId: ' + userId);
            setConnected(true);
            stompClient.subscribe('/user/' + userId + '/chat', (msg) => {
                const message = JSON.parse(msg.body);
                console.log('📩 Получено сообщение:', message);
                setMessages((prev) => [...prev, message]);
            });
        });
        stompClientRef.current = stompClient;

        return () => {
            stompClient.disconnect(() => {
                console.log('❌ WebSocket для чата отключен');
            });
        };
    }, [userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const startChat = async (e) => {
        e.preventDefault();
        if (!recipientId.trim()) {
            setError('Введите ID собеседника');
            return;
        }

        try {
            // const response = await fetch(`http://localhost:8080/api/user/exists/${recipientId}`);
            // const exists = await response.json();
            // if (!exists) {
            //     setError('Пользователь с таким ID не найден');
            //     return;
            // }
            setError(null);
            setChatStarted(true);
            console.log('💬 Чат начат с пользователем: ' + recipientId);
        } catch (err) {
            console.error('Ошибка при проверке ID:', err);
            setError('Не удалось проверить ID. Попробуйте снова.');
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim() || !connected || !stompClientRef.current) return;

        const message = {
            content: messageInput,
            senderId: userId,
            recipientId: recipientId,
            timestamp: new Date().toISOString(),
        };

        stompClientRef.current.send('/app/chat/send', {}, JSON.stringify(message));
        console.log('📤 Отправлено сообщение:', message);
        setMessageInput('');
    };

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mt-4">
            <h3 className="text-lg font-bold mb-2">Личный чат</h3>
            <p className="text-sm text-gray-600 mb-2">Ваш ID: {userId}</p>
            {!chatStarted ? (
                <form onSubmit={startChat} className="flex flex-col">
                    <input
                        type="text"
                        value={recipientId}
                        onChange={(e) => setRecipientId(e.target.value)}
                        placeholder="Введите ID собеседника..."
                        className="p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <button
                        type="submit"
                        disabled={!recipientId.trim()}
                        className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600
                            ${!recipientId.trim() ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                    >
                        Начать чат
                    </button>
                </form>
            ) : (
                <>
                    <p className="text-sm text-gray-600 mb-2">Чат с пользователем: {recipientId}</p>
                    <div className="h-64 overflow-y-auto mb-2 p-2 border border-gray-200 rounded">
                        {messages
                            .filter(
                                (msg) =>
                                    (msg.senderId === userId && msg.recipientId === recipientId) ||
                                    (msg.senderId === recipientId && msg.recipientId === userId)
                            )
                            .map((msg, index) => (
                                <div
                                    key={index}
                                    className={`mb-2 ${
                                        msg.senderId === userId ? 'text-right' : 'text-left'
                                    }`}
                                >
                                    <span
                                        className={`font-semibold ${
                                            msg.senderId === userId ? 'text-blue-600' : 'text-green-600'
                                        }`}
                                    >
                                        {msg.senderId === userId ? 'Вы' : msg.senderId}
                                    </span>
                                    <span className="text-gray-500 text-sm ml-2">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                    <p className="text-gray-800">{msg.content}</p>
                                </div>
                            ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={sendMessage} className="flex">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Введите сообщение..."
                            className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!connected}
                        />
                        <button
                            type="submit"
                            disabled={!connected || !messageInput.trim()}
                            className={`p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600
                                ${!connected || !messageInput.trim() ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                        >
                            Отправить
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default Chat;