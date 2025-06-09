import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import GameStatus from './components/GameStatus'; // Предполагается, что этот компонент уже создан
import './GuestChessGame.css'; // Предполагается, что стили для компонента уже созданы

function GuestChessGame({ onBack }) {
    const [connected, setConnected] = useState(false);
    const [joinedGame, setJoinedGame] = useState(false);
    const [gameId, setGameId] = useState(null);
    const [position, setPosition] = useState('start');
    const [error, setError] = useState(null);
    const [gameResult, setGameResult] = useState(null);
    const [playerColor, setPlayerColor] = useState(null);
    const [sideToMove, setSideToMove] = useState('WHITE');
    const [isSearching, setIsSearching] = useState(false);
    const stompClientRef = useRef(null);

    useEffect(() => {
        const socket = new SockJS('http://localhost:8080/ws-game');
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, () => {
            console.log('✅ WebSocket подключен');
            setConnected(true);
        });
        stompClientRef.current = stompClient;

        return () => {
            stompClient.disconnect(() => {
                console.log('❌ WebSocket отключен');
            });
        };
    }, []);

    useEffect(() => {
        if (!gameId || !playerColor || !joinedGame) {
            console.log('🚫 Обработчик beforeunload не добавлен:', { gameId, playerColor, joinedGame });
            return;
        }

        console.log('🛠️ Добавление обработчика beforeunload:', { gameId, playerColor });

        const handleBeforeUnload = () => {
            console.log('📴 Отправка запроса на дисконнект:', { gameId, playerColor });
            const blob = new Blob([JSON.stringify({ playerColor })], { type: 'application/json' });
            navigator.sendBeacon(`http://localhost:8080/guest/api/game/disconnect/${gameId}`, blob);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            console.log('🧹 Удаление обработчика beforeunload:', { gameId, playerColor });
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [gameId, playerColor, joinedGame]);

    const subscribeToGameState = (gameId) => {
        if (stompClientRef.current) {
            stompClientRef.current.subscribe(`/topic/game.state/${gameId}`, (msg) => {
                const gameState = JSON.parse(msg.body);
                console.log('📬 Получено обновление состояния игры:', gameState);
                if (gameState.error) {
                    setError(gameState.error);
                    setGameResult(null);
                } else {
                    setPosition(gameState.fen);
                    setSideToMove(gameState.sideToMove);
                    setError(null);
                    if (gameState.gameResult) {
                        setGameResult(gameState.gameResult);
                    }
                }
            });
        }
    };

    const findGame = async () => {
        if (!connected || !stompClientRef.current || isSearching) return;

        setIsSearching(true);
        try {
            const response = await fetch('http://localhost:8080/guest/api/game/start', {
                method: 'POST'
            });
            const data = await response.json();
            console.log('🎮 Ответ от /api/game/start:', data);

            const { gameId, waiting, fen, playerColor, sideToMove } = data;
            setGameId(gameId);
            setPlayerColor(playerColor);

            // Подписываемся на обновления состояния игры сразу
            subscribeToGameState(gameId);

            if (waiting) {
                stompClientRef.current.subscribe(`/queue/game.found/${gameId}`, (message) => {
                    const body = JSON.parse(message.body);
                    console.log('📬 Игра найдена!', body);
                    setJoinedGame(true);
                    setPosition(body.fen);
                    setPlayerColor(body.playerColor);
                    setSideToMove(body.sideToMove);
                    setIsSearching(false);
                });
            } else {
                setJoinedGame(true);
                setPosition(fen);
                setSideToMove(sideToMove);
                setIsSearching(false);
            }
        } catch (err) {
            console.error('Ошибка при поиске игры:', err);
            setError('Не удалось найти игру. Попробуйте снова.');
            setIsSearching(false);
        }
    };

    const resignGame = async () => {
        if (!gameId || !playerColor) return;

        try {
            const response = await fetch(`http://localhost:8080/guest/api/game/resign/${gameId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ playerColor })
            });
            const data = await response.json();
            console.log('🏳️ Ответ от /api/game/resign:', data);
            if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            console.error('Ошибка при сдаче игры:', err);
            setError('Не удалось сдаться. Попробуйте снова.');
        }
    };

    const onDrop = ({ sourceSquare, targetSquare }) => {
        if (gameId && stompClientRef.current && !gameResult && playerColor === sideToMove) {
            const move = `${sourceSquare}${targetSquare}`;
            console.log('Отправка хода:', move);
            stompClientRef.current.send(`/app/game/move/${gameId}`, {}, JSON.stringify({
                move,
                playerColor
            }));
        }
    };

    const handleBack = () => {
        if (stompClientRef.current) {
            stompClientRef.current.disconnect(() => {
                console.log('❌ WebSocket отключен'); 
            });
        }
        onBack();
    };

    return (
        <div className="guest-game-container">
            <h2 className="guest-game-title">Шахматы для гостей</h2>
            {!joinedGame ? (
                <button
                    onClick={findGame}
                    disabled={!connected || isSearching}
                    className={`guest-game-button ${isSearching || !connected ? 'btn-disabled' : 'btn-active'}`}
                >
                    {isSearching ? (
                        <>
                            <svg
                                className="spinner-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="spinner-background"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="spinner-foreground"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Поиск...
                        </>
                    ) : (
                        'Найти игру'
                    )}
                </button>
            ) : (
                <GameStatus
                    gameId={gameId}
                    playerColor={playerColor}
                    sideToMove={sideToMove}
                    error={error}
                    gameResult={gameResult}
                    position={position}
                    onDrop={onDrop}
                    resignGame={resignGame}
                    handleBack={handleBack}
                />
            )}
        </div>
    );
}

export default GuestChessGame;