import React, { useState, useEffect } from 'react';
import { Base64 } from 'js-base64';

function UserProfile({ userId, credentials, onBack }) {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [inviteStatus, setInviteStatus] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const authHeader = 'Basic ' + Base64.encode(`${credentials.username}:${credentials.password}`);
                const response = await fetch(`http://localhost:8080/users/getInfo?id=${userId}`, {
                    headers: {
                        'Authorization': authHeader
                    }
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Ошибка сервера');
                }
                const data = await response.json();
                setProfile(data);
                console.log('✅ Профиль пользователя загружен:', data);
            } catch (err) {
                console.error('Ошибка при загрузке профиля:', err);
                setError(err.message || 'Не удалось загрузить профиль');
            }
        };
        fetchProfile();
    }, [userId, credentials]);

    const handleInviteFriend = async () => {
        try {
            const authHeader = 'Basic ' + Base64.encode(`${credentials.username}:${credentials.password}`);
            const response = await fetch(`http://localhost:8080/friends/sendInvite/${userId}`, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Ошибка сервера');
            }
            setInviteStatus('Запрос в друзья отправлен!');
            console.log('✅ Запрос в друзья отправлен для userId:', userId);
        } catch (err) {
            console.error('Ошибка при отправке запроса:', err);
            setInviteStatus(err.message || 'Не удалось отправить запрос в друзья');
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

    if (!profile) {
        return (
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-600">Загрузка...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Профиль пользователя</h2>
            <div className="space-y-3">
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">ID:</span>
                    <span>{profile.id}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span>{profile.email}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Рейтинг:</span>
                    <span>{profile.rating}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Победы:</span>
                    <span>{profile.wins}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Ничьи:</span>
                    <span>{profile.draws}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Поражения:</span>
                    <span>{profile.losses}</span>
                </div>
            </div>
            {inviteStatus && (
                <p className={`mt-4 text-sm ${inviteStatus.includes('успех') ? 'text-green-500' : 'text-red-500'}`}>
                    {inviteStatus}
                </p>
            )}
            <div className="flex space-x-4 mt-6">
                <button
                    onClick={handleInviteFriend}
                    className="flex-1 p-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    disabled={inviteStatus === 'Запрос в друзья отправлен!'}
                >
                    Пригласить в дружбу
                </button>
                <button
                    onClick={onBack}
                    className="flex-1 p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Назад
                </button>
            </div>
        </div>
    );
}

export default UserProfile;