import React, { useState } from 'react';

function Login({ onBack, onLoginSuccess }) {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) {
            setError('Введите логин и пароль');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Ошибка сервера');
            }

            const id = await response.json();
            console.log('✅ Успешный вход, ID:', id);
            setError(null);
            onLoginSuccess(id, email, password);
        } catch (err) {
            console.error('Ошибка при входе:', err);
            setError(err.message || 'Не удалось войти. Проверьте данные и попробуйте снова.');
        }
    };

    return (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Вход</h2>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    placeholder="Логин"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Пароль"
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={!email.trim() || !password.trim()}
                    className={`p-2 bg-blue-500 text-white rounded hover:bg-blue-600
                        ${!email.trim() || !password.trim() ? 'bg-gray-400 cursor-not-allowed' : ''}`}
                >
                    Войти
                </button>
                <button
                    type="button"
                    onClick={onBack}
                    className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    Назад
                </button>
            </form>
        </div>
    );
}

export default Login;