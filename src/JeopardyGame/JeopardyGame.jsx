// src/JeopardyGame/JeopardyGame.jsx
import React, { useState } from 'react';
import './JeopardyGame.css';

const initialData = [
  {
    category: "Мое прошлое",
    questions: [
      { id: 1, value: 100, q: "Кем я мечтала стать в детстве (профессия)?", a: "Няня" },
      { id: 2, value: 200, q: "Какой был мой любимый мультфильм в детстве?", a: "Бременские музыканты/Лило и Стич" },
      { id: 3, value: 300, q: "Сколько мне было лет, когда я впервые выпила алкоголь с друзьями", a: "16" },
      { id: 4, value: 400, q: "Мой нелюбимый школьный предмет", a: "География" },
      { id: 5, value: 500, q: "Сколько городов России я посетила (Считаем только крупные и время нахождение в городе более суток)", a: "10" },
    ]
  },
  {
    category: "Привычки и вкусы",
    questions: [
      { id: 6, value: 100, q: "Какой мой самый любимый вид кухни (или конкретное блюдо)", a: "Грузинская кухня" },
      { id: 7, value: 200, q: "Любимая форма моего имени", a: "Полинка" },
      { id: 8, value: 300, q: "Нелюбимый жанр в кино", a: "Ужасы" },
      { id: 9, value: 400, q: "Какую машину я бы себе хотела (+100 баллов за цвет)", a: "Nissan Juke красный" },
      { id: 10, value: 500, q: "Мой типаж", a: "Лучший друг главного героя" },
    ]
  },
  {
    category: "Мечты и секреты",
    questions: [
      { id: 11, value: 100, q: "Мое НЕлюбимое женское имя", a: "Марина" },
      { id: 12, value: 200, q: "Мой самый бесполезный, но забавный талант/умение? ", a: "Перевернуть язык" },
      { id: 13, value: 300, q: "Мой краш", a: "Павел Дуров/Дима Маслеников" },
      { id: 14, value: 400, q: "Мое хобби, которого я стесняюсь", a: "Изучение турецкого" },
      { id: 15, value: 500, q: "Имя, которое тут же может вывести меня из себя", a: "Магид / Любое имя вашего бывшего" },
    ]
  }
];

const JeopardyGame = () => {
  const [teams, setTeams] = useState([
    { id: 1, name: 'Люба', score: 0, color: '#F4FCAB' },
    { id: 2, name: 'Кристинна', score: 0, color: '#EBA0C0' },
    { id: 3, name: 'Аэлита', score: 0, color: '#95DBAF' },
    // { id: 4, name: 'Team 4', score: 0, color: '#e6ffcc' },
  ]);

  const [activeQuestion, setActiveQuestion] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [visited, setVisited] = useState(new Set());

  const handleQuestionClick = (q) => {
    if (visited.has(q.id)) return;
    setActiveQuestion(q);
    setShowAnswer(false);
  };

  // Метод ручного изменения счета (с боковой панели)
  const adjustScore = (teamId, amount) => {
    setTeams(teams.map(t => t.id === teamId ? { ...t, score: t.score + amount } : t));
  };

  // Метод автоматического начисления баллов за текущий вопрос
  const handleAwardPoints = (teamId, isCorrect) => {
    if (!activeQuestion) return;
    const points = activeQuestion.value;
    adjustScore(teamId, isCorrect ? points : -points);
  };
  const closeQuestion = () => {
    setVisited(prev => new Set(prev).add(activeQuestion.id));
    setActiveQuestion(null);
  };

  return (
    <div className="jeopardy-container">
      {/* Боковая панель команд */}
      <div className="sidebar">
        {teams.map(team => (
          <div key={team.id} className="team-card" style={{ backgroundColor: team.color }}>
            <div className="team-name">{team.name}</div>
            <div className="score">{team.score}</div>
            <div className="score-controls">
              {/* Кнопки быстрого изменения счета на +-100 вручную */}
              <button className="score-btn minus" onClick={() => adjustScore(team.id, -100)}>-</button>
              <button className="score-btn plus" onClick={() => adjustScore(team.id, 100)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Игровое поле */}
      <div className="board">
        {initialData.map((cat, idx) => (
          <div key={idx} className="column">
            <div className="header-card">{cat.category}</div>
            {cat.questions.map(q => {
              const isVisited = visited.has(q.id);
              return (
                <div
                  key={q.id}
                  className={`question-card ${isVisited ? 'visited' : ''}`}
                  onClick={() => handleQuestionClick(q)}
                >
                  {q.value}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Модальное окно вопроса */}
      {activeQuestion && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="modal-text">{activeQuestion.q}</h2>
            
            {showAnswer && <div className="answer-text">{activeQuestion.a}</div>}
            
            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? "Скрыть ответ" : "Показать ответ"}
              </button>
              <button className="btn btn-secondary" onClick={closeQuestion}>
                Закрыть вопрос
              </button>
            </div>

            {/* Быстрое начисление баллов прямо в модальном окне */}
            <div className="modal-scoring">
              <h4>Начислить баллы за этот вопрос (+/- {activeQuestion.value}):</h4>
              <div className="modal-teams-list">
                {teams.map(team => (
                  <div key={team.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{team.name}</span>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <button 
                        className="score-btn minus" 
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                        onClick={() => handleAwardPoints(team.id, false)}
                      >
                        -
                      </button>
                      <button 
                        className="score-btn plus" 
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                        onClick={() => handleAwardPoints(team.id, true)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JeopardyGame;
