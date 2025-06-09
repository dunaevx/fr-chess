import React, { useState } from 'react';

const ChessLanding = ({ onStartGame, onLogin, onRegister, onPlayAsGuest }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Хедер с кнопками Войти и Регистрация */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold">Шахматы Онлайн</h1>
          <div className="flex space-x-4">
            <button
              onClick={onLogin}
              className="px-4 py-2 text-sm md:text-base font-semibold text-white bg-transparent border border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Войти
            </button>
            <button
              onClick={onRegister}
              className="px-4 py-2 text-sm md:text-base font-semibold text-white bg-transparent border border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
            >
              Регистрация
            </button>
          </div>
        </div>
      </header>

      {/* Герой-секция */}
      <section className="bg-gradient-to-b from-blue-100 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
            Играй в шахматы онлайн!
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Присоединяйся к миллионам игроков по всему миру. Играй с друзьями или случайными соперниками в любое время!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onPlayAsGuest}
              className={`inline-block px-8 py-4 text-lg font-semibold text-white rounded-lg shadow-md transition-transform transform
                ${isHovered ? 'scale-105 bg-blue-700' : 'bg-blue-500'} hover:bg-blue-600`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Играть как гость
            </button>
          </div>
        </div>
      </section>

      {/* Секция с преимуществами */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">Почему выбирают нас?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">♟️</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Быстрый поиск соперников</h4>
              <p className="text-gray-600">
                Мгновенно находите игроков вашего уровня для захватывающих матчей.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">🌐</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Играйте везде</h4>
              <p className="text-gray-600">
                Доступ к игре с любого устройства — компьютера, планшета или телефона.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">📊</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Улучшайте навыки</h4>
              <p className="text-gray-600">
                Анализируйте свои партии и учитесь на ошибках с нашими инструментами.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Секция призыва к действию */}
      <section id="play" className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Готовы к вызову?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Сыграйте свою первую партию прямо сейчас и станьте частью мирового шахматного сообщества!
          </p>
          <button
            onClick={onStartGame}
            className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition"
          >
            Играть сейчас
          </button>
        </div>
      </section>

      {/* Футер */}
      <footer id="contact" className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-4">Свяжитесь с нами: support@chessonline.com</p>
          <p className="text-sm">© 2025 Шахматы Онлайн. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default ChessLanding;