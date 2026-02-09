const renderRules = () => {
    return `<div class="rules-container">
        <div class="header">
            <h1>Морской Бой</h1>
            <div class="subtitle">Правила  игры морской бой </div>
        </div>

        <div class="content">
            <div class="rules-section">
                <h2 class="section-title">📜 Основные правила</h2>
                <ul class="rules-list">
                    <li>
                        <strong>Цель игры:</strong> Первым потопить все корабли. 
                    </li>
                    <li>
                        <strong>Размер поля:</strong> Игровое поле представляет собой квадрат 7×7 клеток. 
                        Координаты обозначаются цифрами (0-6) по горизонтали и буквами (A-G) по вертикали.
                    </li>
                    <li>
                        <strong>Корабли:</strong> Потопить нужно  3 корабля по 3 клетки каждый. 
                        Корабли могут располагаться горизонтально или вертикально.
                    </li>
                    <li>
                        <strong>Управление:</strong> Для выстрела кликните мышкой по любой клетке на поле. 
                        Компьютер автоматически отвечает на ваш ход.
                    </li>
                    <li>
                        <strong>Результат выстрела:</strong> 
    <div class="img-hit">
        <span class="sub-hit">Попадание</span> - если попали в корабль.
    </div>
    <div class="img-miss">
        <span class="sub-miss">Промах</span> - если выстрел мимо корабля.
    </div>
                    </li>
                </ul>
            </div>

            <div class="right-column">
                <div class="info-card game">
                    <h3 class="card-title">⚓ Правила расстановки</h3>
                    <p>Корабли размещаются с соблюдением правил:</p>
                    <ul class="ship-list">
                        <li>Корабли не могут соприкасаться друг с другом сторонами или углами</li>
                        <li>Между кораблями должна быть минимум 1 свободная клетка</li>
                        <li>Корабли не могут выходить за границы поля 7×7</li>
                        <li>Автоматическая расстановка гарантирует правильное размещение</li>
                    </ul>
                </div>

                <div class="info-card controls">
                    <h3 class="card-title">🎮 Управление и статусы</h3>
                    <p><strong>Управление:</strong> Клик мышкой по клетке поля противника</p>
                    
                    <div class="compact" style="margin: 15px 0;">
                        <p><strong>Статусы игры:</strong></p>
                        <div class="status-grid">
                            <span class="status-indicator status-planning">Стратегия</span>
                            <span class="status-indicator status-battle">Бой</span>
                            <span class="status-indicator status-win">Победа</span>
                            <span class="status-indicator status-lose">Поражение</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Нижний блок -->
        <div class="footer">
            <p class="game-tip">
                💡 Совет: Старайтесь стрелять по стратегическим точкам и обращать внимание на вывод сообщений!
            </p>
        </div>
    </div>
`
}