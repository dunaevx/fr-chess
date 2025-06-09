import React, { useState, useEffect, useRef } from 'react';
import Chessboard from 'chessboardjsx';
import './GameStatus.css';
import ChatPanel from './ChatPanel';
import GameOverModal from './GameOverModal';


const GameStatus = ({
  gameId,
  playerColor,
  sideToMove,
  error,
  gameResult,
  position,
  onDrop,
  resignGame,
  handleBack,
}) => {
  const [whiteTime, setWhiteTime] = useState(10 * 60);
  const [blackTime, setBlackTime] = useState(10 * 60);
  const timerRef = useRef(null);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (gameResult || whiteTime === 0 || blackTime === 0) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      if (sideToMove === 'WHITE') {
        setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
      } else {
        setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [sideToMove, gameResult]);

  const getGameStatus = () => {
    if (gameResult) return gameResult;
    if (whiteTime === 0) return 'Время белых истекло! Черные победили';
    if (blackTime === 0) return 'Время черных истекло! Белые победили';
    return null;
  };

  const isWhiteBottom = playerColor === 'WHITE';

  // Вычисление кто сверху, кто снизу
  const topColor = isWhiteBottom ? 'BLACK' : 'WHITE';
  const bottomColor = isWhiteBottom ? 'WHITE' : 'BLACK';

  const renderPlayerTimer = (color, isTop) => {
    const isYou = playerColor === color;
    const name = isYou ? 'Вы' : 'Гость';
    const time = formatTime(color === 'WHITE' ? whiteTime : blackTime);

    return (
      <div className={`player-timer ${isTop ? 'top' : 'bottom'}`}>
        <div>{name} ({color === 'WHITE' ? 'Белые' : 'Черные'})</div>
        <div>⏱ {time}</div>
      </div>
    );
  };

  return (
    <div className="game-box">
      <div className="board-wrapper">
        {renderPlayerTimer(topColor, true)}

        <Chessboard
          position={position}
          onDrop={gameResult || playerColor !== sideToMove ? () => {} : onDrop}
          width={400}
          orientation={isWhiteBottom ? 'white' : 'black'}
        />

        {renderPlayerTimer(bottomColor, false)}
      </div>

      <div className="info-panel">
        <p className="p1">Игра началась. ID: {gameId}</p>
        <ChatPanel gameId={gameId} playerColor={playerColor} />
        <p className="p3">Сейчас ходят: {sideToMove === 'WHITE' ? 'Белые' : 'Черные'}</p>

        {error && <p className="error-text">{error}</p>}

        {<GameOverModal
  isOpen={!!getGameStatus()}
  message={getGameStatus()}
  onClose={handleBack}
/>
}

        <div className="control-buttons">
          <button
            onClick={resignGame}
            disabled={gameResult || whiteTime === 0 || blackTime === 0}
            className={`btn ${gameResult || whiteTime === 0 || blackTime === 0 ? 'btn-disabled' : 'btn-danger'}`}
          >
            Сдаться
          </button>
          <button onClick={handleBack} className="btn btn-active ">  
            Вернуться
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameStatus;
