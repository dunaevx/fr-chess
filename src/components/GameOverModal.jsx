import React from 'react';
import './GameOverModal.css';

const GameOverModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <h2 className="modal-title">Игра завершена</h2>
        <p className="modal-message">{message}</p>
        <button className="btn btn-active" onClick={onClose}>
          Вернуться
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
