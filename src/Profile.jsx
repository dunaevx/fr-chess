import React, { useState, useEffect } from 'react';
import { Base64 } from 'js-base64';

function Profile({ userId, credentials, onBack }) {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

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
                console.log('✅ Профиль загружен:', data);
            } catch (err) {
                console.error('Ошибка при загрузке профиля:', err);
                setError(err.message || 'Не удалось загрузить профиль');
            }
        };
        fetchProfile();
    }, [userId, credentials]);

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
            <button
                onClick={onBack}
                className="mt-6 w-full p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
                Назад
            </button>
        </div>
    );
}

export default Profile;