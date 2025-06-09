import React, { useState } from 'react';
import GuestChessGame from './GuestChessGame';
import Login from './Login';
import Register from './pages/Register/Register';
import { MainPage, InvitesList, FriendsList, Leaderboard } from './MainPage';
import Profile from './Profile';
import UserProfile from './UserProfile';
import ChessLanding from './pages/Landing/ChessLanding';

function App() {
    const [showGuestGame, setShowGuestGame] = useState(false);
    const [userId, setUserId] = useState('');
    const [inputUserId, setInputUserId] = useState('');
    const [error, setError] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authUserId, setAuthUserId] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [showInvites, setShowInvites] = useState(false);
    const [showFriends, setShowFriends] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handlePlayAsGuest = () => {
        setShowGuestGame(true);
    };

    const handleStartGame = () => {
        if (!isAuthenticated) {
            setError('Пожалуйста, войдите в систему, чтобы начать игру');
            return;
        }
        setShowGuestGame(true); // Можно заменить на другой компонент для авторизованных игр
    };

    const handleLogin = () => {
        setShowLogin(true);
    };

    const handleRegister = () => {
        setShowRegister(true);
        console.log('Открыть форму регистрации');
    };

    const handleBack = () => {
        setShowGuestGame(false);
        setShowLogin(false);
        setShowRegister(false);
        setShowProfile(false);
        setShowUserProfile(false);
        setShowInvites(false);
        setShowFriends(false);
        setShowLeaderboard(false);
        setError(null);
    };

    const handleStartChat = async (e) => {
        e.preventDefault();
        if (!inputUserId.trim()) {
            setError('Введите ваш ID');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/user/exists/${inputUserId}`);
            if (!response.ok) {
                throw new Error('Ошибка сервера');
            }
            const exists = await response.json();
            if (!exists) {
                setError('Пользователь с таким ID не найден');
                return;
            }
            setUserId(inputUserId);
            setError(null);
            console.log('✅ Установлен userId:', inputUserId);
        } catch (err) {
            console.error('Ошибка при проверке ID:', err);
            setError('Не удалось проверить ID. Убедитесь, что сервер работает, и попробуйте снова.');
        }
    };

    const handleLoginSuccess = (id, username, password) => {
        setAuthUserId(id);
        setCredentials({ username, password });
        setIsAuthenticated(true);
        setShowLogin(false);
        console.log('✅ Авторизован пользователь с ID:', id);
    };

    const handleRegisterSuccess = (id, username, password) => {
        setAuthUserId(id);
        setCredentials({ username, password });
        setIsAuthenticated(true);
        setShowRegister(false);
        console.log('✅ Зарегистрирован пользователь с ID:', id);
    };

    const handleShowProfile = () => {
        setShowProfile(true);
    };

    const handleShowUserProfile = (userId) => {
        setSelectedUserId(userId);
        setShowUserProfile(true);
        console.log('📋 Отображение профиля пользователя:', userId);
    };

    const handleShowInvites = () => {
        setShowInvites(true);
        console.log('📬 Отображение запросов в друзья');
    };

    const handleShowFriends = () => {
        setShowFriends(true);
        console.log('📋 Отображение списка друзей');
    };

    const handleShowLeaderboard = () => {
        setShowLeaderboard(true);
        console.log('🏆 Отображение таблицы лидеров');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {isAuthenticated && showLeaderboard ? (
                <Leaderboard credentials={credentials} onBack={handleBack} />
            ) : isAuthenticated && showFriends ? (
                <FriendsList credentials={credentials} onBack={handleBack} />
            ) : isAuthenticated && showInvites ? (
                <InvitesList credentials={credentials} onBack={handleBack} />
            ) : isAuthenticated && showUserProfile ? (
                <UserProfile userId={selectedUserId} credentials={credentials} onBack={handleBack} />
            ) : isAuthenticated && showProfile ? (
                <Profile userId={authUserId} credentials={credentials} onBack={handleBack} />
            ) : isAuthenticated ? (
                <MainPage
                    onLogout={() => setIsAuthenticated(false)}
                    onShowProfile={handleShowProfile}
                    onShowUserProfile={handleShowUserProfile}
                    onShowInvites={handleShowInvites}
                    onShowFriends={handleShowFriends}
                    onShowLeaderboard={handleShowLeaderboard}
                    credentials={credentials}
                />
            ) : showRegister ? (
                <Register onBack={handleBack} onRegisterSuccess={handleRegisterSuccess} />
            ) : showLogin ? (
                <Login onBack={handleBack} onLoginSuccess={handleLoginSuccess} />
            ) : showGuestGame ? (
                <GuestChessGame onBack={handleBack} />
            ) : (
                <>
                    <ChessLanding
                        onStartGame={handleStartGame}
                        onLogin={handleLogin}
                        onRegister={handleRegister}
                        onPlayAsGuest={handlePlayAsGuest}
                    />
                </>
            )}
        </div>
    );
}

export default App;