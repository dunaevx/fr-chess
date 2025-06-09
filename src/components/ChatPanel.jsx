import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import "./ChatPanel.css";
import imgSend from "../assets/Email Send.png";

export default function ChatPanel({ gameId, playerColor }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);

  useEffect(() => {
    // Подключение к WebSocket
    const socket = new SockJS("http://localhost:8080/ws-game");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });
    stompClientRef.current = stompClient;

    stompClient.onConnect = () => {
      // Подписка на канал чата
      stompClient.subscribe(`/topic/chat/${gameId}`, (message) => {
        const data = JSON.parse(message.body);
        if (data.error) {
          console.error("Chat error:", data.error);
          return;
        }
        setMessages(
            data.map((msg) => ({
              id: `${msg.sender}-${msg.timestamp}`,
              sender: msg.sender === playerColor ? "you" : "opponent",
              text: msg.text,
              timestamp: msg.timestamp,
              avatar:
                  msg.sender === playerColor
                      ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }))
        );
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error:", frame);
    };

    stompClient.activate();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [gameId, playerColor]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && stompClientRef.current && stompClientRef.current.active) {
      const messagePayload = {
        text: newMessage.trim(),
        playerColor: playerColor,
      };
      stompClientRef.current.publish({
        destination: `/app/chat/${gameId}`,
        body: JSON.stringify(messagePayload),
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
      <div className="chat-container">
        <div className="chat-messages">
          <div className="messages-list">
            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`message-row ${message.sender === "you" ? "reverse" : ""}`}
                >
                  <img src={message.avatar} alt="avatar" className="avatar" />
                  <div className={`message-bubble ${message.sender === "you" ? "you" : "other"}`}>
                    <p className="message-text">{message.text}</p>
                    <span className="message-time">{message.timestamp}</span>
                  </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="chat-input">
          <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Написать сообщение..."
          />
          <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              title="Отправить"
              className="send-button"
          >
            <img src={imgSend} alt="Отправить" width="20" height="20" />
          </button>
        </div>
      </div>
  );
}