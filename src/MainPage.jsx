import React, { useState, useEffect, useMemo, memo } from 'react';
import debounce from 'lodash.debounce';
import { Base64 } from 'js-base64';

// Компонент для отдельного результата поиска
const SearchResult = memo(({ user, onClick }) => (
    <div
        className="p-2 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
        onClick={() => onClick(user.id)}
    >
        <div className="flex justify-between">
            <span className="font-semibold">ID:</span>
            <span>{user.id}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
        </div>
    </div>
));

// Компонент для отдельного друга
const FriendItem = memo(({ user }) => (
    <div className="p-2 border-b last:border-b-0 hover:bg-gray-100">
        <div className="flex justify-between">
            <span className="font-semibold">ID:</span>
            <span>{user.id}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
        </div>
    </div>
));

// Компонент для строки таблицы лидеров
const LeaderboardItem = memo(({ entry }) => (
    <tr className="border-b last:border-b-0 hover:bg-gray-100">
        <td className="p-2">{entry.user.id}</td>
        <td className="p-2">{entry.user.email}</td>
        <td className="p-2">{entry.rating}</td>
        <td className="p-2">{entry.wins}</td>
        <td className="p-2">{entry.losses}</td>
        <td className="p-2">{entry.draws}</td>
        <td className="p-2">{new Date(entry.updatedAt).toLocaleDateString()}</td>
    </tr>
));

// Компонент для списка запросов в друзья
const InviteItem = memo(({ user, onAnswerInvite }) => (
    <div className="p-2 border-b last:border-b-0 hover:bg-gray-100">
        <div className="flex justify-between">
            <span className="font-semibold">ID:</span>
            <span>{user.id}</span>
        </div>
        <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
        </div>
        <div className="flex space-x-2 mt-2">
            <button
                onClick={() => onAnswerInvite(user.id, 'ACCEPTED')}
                className="flex-1 p-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Принять
            </button>
            <button
                onClick={() => onAnswerInvite(user.id, 'REJECTED')}
                className="flex-1 p-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
                Отклонить
            </button>
        </div>
    </div>
));

function Leaderboard({ credentials, onBack }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const authHeader = 'Basic ' + Base64.encode(`${credentials.username}:${credentials.password}`);
                const response = await fetch('http://localhost:8080/leaders/getLeaderboard', {
                    headers: {
                        'Authorization': authHeader
                    }
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Ошибка сервера');
                }
                const data = await response.json();
                setLeaderboard(data);
                console.log('✅ Таблица лидеров загружена:', data);
            } catch (err) {
                console.error('Ошибка при загрузке таблицы лидеров:', err);
                setError(err.message || 'Не удалось загрузить таблицу лидеров');
            }
        };
        fetchLeaderboard();
    }, [credentials]);

    if (error) {
        return (
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={onBack}
                    className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Назад
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Таблица лидеров</h2>
            {leaderboard.length === 0 ? (
                <p className="text-gray-600 text-center">Таблица лидеров пуста</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded">
                        <thead>
                        <tr className="bg-gray-50">
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Email</th>
                            <th className="p-2 text-left">Рейтинг</th>
                            <th className="p-2 text-left">Победы</th>
                            <th className="p-2 text-left">Поражения</th>
                            <th className="p-2 text-left">Ничьи</th>
                            <th className="p-2 text-left">Обновлено</th>
                        </tr>
                        </thead>
                        <tbody>
                        {leaderboard.map((entry) => (
                            <LeaderboardItem key={entry.id} entry={entry} />
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            <button
                onClick={onBack}
                className="mt-4 w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
                Назад
            </button>
        </div>
    );
}

function FriendsList({ credentials, onBack }) {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const authHeader = 'Basic ' + Base64.encode(`${credentials.username}:${credentials.password}`);
                const response = await fetch('http://localhost:8080/friends/getMyFriends', {
                    headers: {
                        'Authorization': authHeader
                    }
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Ошибка сервера');
                }
                const data = await response.json();
                setFriends(data);
                console.log('✅ Друзья загружены:', data);
            } catch (err) {
                console.error('Ошибка при загрузке друзей:', err);
                setError(err.message || 'Не удалось загрузить список друзей');
            }
        };
        fetchFriends();
    }, [credentials]);

    if (error) {
        return (
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={onBack}
                    className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Назад
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Мои друзья</h2>
            {friends.length === 0 ? (
                <p className="text-gray-600">У вас пока нет друзей</p>
            ) : (
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded">
                    {friends.map((user) => (
                        <FriendItem key={user.id} user={user} />
                    ))}
                </div>
            )}
            <button
                onClick={onBack}
                className="mt-4 w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
                Назад
            </button>
        </div>
    );
}

function InvitesList({ credentials, onBack }) {
    const [invites, setInvites] = useState([]);
    const [error, setError] = useState(null);
    const [responseStatus, setResponseStatus] = useState({});

    const fetchInvites = async () => {
        try {
            const authHeader = 'Basic ' + Base64.encode(`${credentials.username}:${credentials.password}`);
            const response = await fetch('http://localhost:8080/friends/getInvitesForUser', {
                headers: {
                    'Authorization': authHeader
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Ошибка сервера');
            }
            const data = await response.json();
            setInvites(data);
            console.log('✅ Запросы в друзья загружены:', data);
        } catch (err) {
            console.error('Ошибка при загрузке запросов:', err);
            setError(err.message || 'Не удалось загрузить запросы в друзья');
        }
    };

    useEffect(() => {
        fetchInvites();
    }, [credentials]);

    const handleAnswerInvite = async (userId, status) => {
        try {
            const authHeader = 'Basic ' + Base64.encode(`${credentials.username}:${credentials.password}`);
            const response = await fetch('http://localhost:8080/friends/answerInvite', {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId, status })
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Ошибка сервера');
            }
            setResponseStatus(prev => ({
                ...prev,
                [userId]: status === 'ACCEPTED' ? 'Принято!' : 'Отклонено!'
            }));
            setInvites(prev => prev.filter(invite => invite.id !== userId));
            console.log(`✅ Запрос в друзья ${status} для userId:`, userId);
        } catch (err) {
            console.error('Ошибка при обработке запроса:', err);
            setResponseStatus(prev => ({
                ...prev,
                [userId]: err.message || `Не удалось ${status === 'ACCEPTED' ? 'принять' : 'отклонить'} запрос`
            }));
        }
    };

    if (error) {
        return (
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={onBack}
                    className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Назад
                </button>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Запросы в друзья</h2>
            {invites.length === 0 ? (
                <p className="text-gray-600">Нет запросов в друзья</p>
            ) : (
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded">
                    {invites.map((user) => (
                        <div key={user.id}>
                            <InviteItem user={user} onAnswerInvite={handleAnswerInvite} />
                            {responseStatus[user.id] && (
                                <p className={`text-sm mt-1 ${responseStatus[user.id].includes('Принято') ? 'text-green-500' : 'text-red-500'}`}>
                                    {responseStatus[user.id]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
            <button
                onClick={onBack}
                className="mt-4 w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
                Назад
            </button>
        </div>
    );
}

function MainPage({ onLogout, onShowProfile, onShowUserProfile, onShowInvites, onShowFriends, onShowLeaderboard, credentials }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState(null);
    const [cache, setCache] = useState(new Map());

    const handlePlay = () => {
        alert('Функция игры пока не реализована');
    };

    const handleShowFriends = () => {
        onShowFriends();
        console.log('📋 Отображение списка друзей');
    };

    const handleShowLeaderboard = () => {
        onShowLeaderboard();
        console.log('🏆 Отображение таблицы лидеров');
    };

    const fetchSearchResults = async (query, signal) => {
        if (!query.trim()) {
            setSearchResults([]);
            setError(null);
            return;
        }

        if (cache.has(query)) {
            setSearchResults(cache.get(query));
            setError(null);
            console.log('🔍 Результаты из кэша:', query);
            return;
        }

        try {
            const authHeader = 'Basic ' + Base64.encode(`${credentials.username}:${credentials.password}`);
            const response = await fetch(`http://localhost:8080/users/search?email=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': authHeader
                },
                signal
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Ошибка сервера');
            }
            const results = await response.json();
            setSearchResults(results);
            setCache(prev => new Map(prev).set(query, results));
            setError(null);
            console.log('🔍 Результаты поиска:', results);
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('Запрос отменён:', query);
                return;
            }
            console.error('Ошибка при поиске:', err);
            setError('Не удалось выполнить поиск');
        }
    };

    const debouncedSearch = useMemo(() => debounce((query, signal) => fetchSearchResults(query, signal), 100), []);

    useEffect(() => {
        const controller = new AbortController();
        debouncedSearch(searchQuery, controller.signal);
        return () => {
            controller.abort();
            debouncedSearch.cancel();
        };
    }, [searchQuery, debouncedSearch]);

    const renderedResults = useMemo(() => (
        searchResults.length > 0 && (
            <div className="mt-4 max-h-64 overflow-y-auto border border-gray-200 rounded">
                {searchResults.map((user) => (
                    <SearchResult key={user.id} user={user} onClick={onShowUserProfile} />
                ))}
            </div>
        )
    ), [searchResults, onShowUserProfile]);

    return (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Добро пожаловать в Шахматы Онлайн!</h2>
            <p className="text-gray-600 mb-8">
                Играйте в шахматы с друзьями или случайными соперниками, улучшайте свои навыки и наслаждайтесь игрой!
            </p>
            <div className="mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по email..."
                    className="w-full max-w-md p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {renderedResults}
            </div>
            <div className="flex justify-center space-x-4">
                <button
                    onClick={handlePlay}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
                    Играть
                </button>
                <button
                    onClick={onShowProfile}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                >
                    Профиль
                </button>
                <button
                    onClick={handleShowFriends}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
                >
                    Мои друзья
                </button>
                <button
                    onClick={onShowInvites}
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                >
                    Мои запросы в друзья
                </button>
                <button
                    onClick={handleShowLeaderboard}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
                >
                    Таблица лидеров
                </button>
                <button
                    onClick={onLogout}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                >
                    Выйти
                </button>
            </div>
        </div>
    );
}

export { MainPage, InvitesList, FriendsList, Leaderboard };