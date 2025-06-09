// src/components/ChessGame.jsx
import React, { useState, useRef } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';

const ChessGame = () => {
    const gameRef = useRef(new Chess());
    const [fen, setFen] = useState('start');
    const [status, setStatus] = useState('');
    const [pgn, setPgn] = useState('');

    const updateGameStatus = () => {
        const game = gameRef.current;
        let statusText = '';

        if (game.isCheckmate()) {
            statusText = `Game over, ${game.turn() === 'w' ? 'Black' : 'White'} is in checkmate.`;
        } else if (game.isDraw()) {
            statusText = 'Game over, drawn position';
        } else {
            statusText = `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
            if (game.isCheck()) {
                statusText += `, ${game.turn() === 'w' ? 'White' : 'Black'} is in check`;
            }
        }

        setFen(game.fen());
        setPgn(game.pgn());
        setStatus(statusText);
    };

    const onDrop = ({ sourceSquare, targetSquare }) => {
        const game = gameRef.current;
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q', // Always promote to queen for simplicity
        });

        if (move === null) return; // illegal move
        setFen(game.fen());
        updateGameStatus();
    };

    return (
        <div>
            <Chessboard
                width={400}
                position={fen}
                onDrop={onDrop}
                draggable
            />
            <div>
                <label>Status:</label>
                <div>{status}</div>
                <label>FEN:</label>
                <div>{fen}</div>
                <label>PGN:</label>
                <div>{pgn}</div>
            </div>
        </div>
    );
};

export default ChessGame;
