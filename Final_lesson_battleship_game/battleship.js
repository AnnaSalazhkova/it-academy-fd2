class GameView {
    constructor() {
        this.messageElement = document.querySelector('.message');
        this.createGameBoard();
    }

    createGameBoard() {
        const board = document.querySelector('.board');
        const table = document.createElement('table');
        table.id = 'battlefield';
        table.style.borderCollapse = 'collapse';
        table.style.position = 'absolute';
        table.style.left = '165px';
        table.style.top = '88px';

        for (let row = 0; row < 7; row++) {
            const tr = document.createElement('tr');

            for (let col = 0; col < 7; col++) {
                const td = document.createElement('td');

                td.setAttribute('data-coord', `${row}${col}`);
                td.classList.add('cell', `col-${row}${col}`);

                td.style.width = '91px';
                td.style.height = '91px';
                td.style.textAlign = 'center';
                td.style.verticalAlign = 'middle';
                td.style.cursor = 'pointer';
                td.style.backgroundColor = 'transparent';

                tr.appendChild(td);
            }
            table.appendChild(tr);
        }

        board.appendChild(table);
    }

    displayMessage(message) {
        this.messageElement.textContent = message;
    }

    displayHit(coordinates) {
        const cell = document.querySelector(`.col-${coordinates}`);
        if (cell) {
            cell.classList.add('hit');
        }
    }

    displayMiss(coordinates) {
        const cell = document.querySelector(`.col-${coordinates}`);
        if (cell) {
            cell.classList.add('miss');
        }
    }
}

class Ship {
    constructor(locations) {
        this.locations = locations; 
        this.hits = locations.map(() => ""); 
    }


    isSunk() {
        return this.hits.every(hit => hit === "hit");
    }

    
    takeHit(coordinates) {
        const index = this.locations.indexOf(coordinates);
        if (index !== -1) {
            this.hits[index] = "hit";
            return true;
        }
        return false;
    }

    occupies(coordinates) {
        return this.locations.includes(coordinates);
    }
}


class GameModel {
    constructor(boardSize = 7, numShips = 3, shipLength = 3) {
        this.boardSize = boardSize;      
        this.numShips = numShips;        
        this.shipLength = shipLength;    
        this.shipsSunk = 0;             
        this.ships = [];             
        this.allShots = [];             

        this.generateRandomShips();
    }

    generateRandomShips() {
        for (let i = 0; i < this.numShips; i++) {
            let ship;
            let attempts = 0;
            const maxAttempts = 100;

            do {
                ship = this.createRandomShip();
                attempts++;
            } while (this.hasCollision(ship) && attempts < maxAttempts);

            this.ships.push(ship);
        }
    }

    
    createRandomShip() {
        const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
        let locations = [];

        if (direction === 'horizontal') {
            const row = Math.floor(Math.random() * this.boardSize);
            const col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));

            for (let i = 0; i < this.shipLength; i++) {
                locations.push(`${row}${col + i}`);
            }
        } else {
            const row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
            const col = Math.floor(Math.random() * this.boardSize);

            for (let i = 0; i < this.shipLength; i++) {
                locations.push(`${row + i}${col}`);
            }
        }

        return new Ship(locations);
    }

    hasCollision(newShip) {
        const allCellsToCheck = this.getAllCellsAroundShip(newShip);

        for (const existingShip of this.ships) {
            for (const location of allCellsToCheck) {
                if (existingShip.occupies(location)) {
                    return true; 
                }
            }
        }
        return false;  
    }

    getAllCellsAroundShip(ship) {
        const cells = new Set();

        
        for (const location of ship.locations) {
            const row = parseInt(location[0]);
            const col = parseInt(location[1]);

            
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const newRow = row + dr;
                    const newCol = col + dc;

                    if (newRow >= 0 && newRow < this.boardSize &&
                        newCol >= 0 && newCol < this.boardSize) {
                        cells.add(`${newRow}${newCol}`);
                    }
                }
            }
        }

        return Array.from(cells);
    }

    
    fire(guess) {
        if (this.allShots.includes(guess)) {
            return {
                hit: true,
                message: "⚠️Вы уже стреляли сюда!",
                sunk: false
            };
        }

        this.allShots.push(guess);

        for (const ship of this.ships) {
            if (ship.occupies(guess)) {
                ship.takeHit(guess);

                if (ship.isSunk()) {
                    this.shipsSunk++;

                    const message = this.isGameOver()
                        ? "🏆 Вы потопили все корабли! Победа!"
                        : `Вы потопили корабль! Осталось ${this.numShips - this.shipsSunk} кораблей.`;

                    return {
                        hit: true,
                        sunk: true,
                        message: message
                    };
                }

                return {
                    hit: true,
                    sunk: false,
                    message: " ⚓Попадание!"
                };
            }
        }
        return {
            hit: false,
            sunk: false,
            message: "💦 Мимо!"
        };
    }

    isGameOver() {
        return this.shipsSunk === this.numShips;
    }
}

class GameController {
    constructor() {
        this.model = new GameModel(); 
        this.view = new GameView();  
        this.guesses = 0;             

        this.setupEventListeners();   
        this.startGame();             
        this.createRestartButton();   
    }

    setupEventListeners() {
        document.addEventListener('click', (event) => {
            const cell = event.target;

            if (cell.classList.contains('cell')) {
                const coordinates = cell.getAttribute('data-coord');
                this.processGuess(coordinates);
            }
        });
    }

    createRestartButton() {
        const restartBtn = document.createElement('button');
        restartBtn.className = 'game-btn restart-btn';
        restartBtn.innerHTML = `
    <span class="btn-icon">🔄</span>Начать заново`;

        restartBtn.onclick = () => this.restartGame();

        document.querySelector('.board').appendChild(restartBtn);
    }

    startGame() {
        this.view.displayMessage("Игра началась! Кликайте по ячейкам для выстрела.");
        console.log("Размещены корабли:");
        this.model.ships.forEach((ship, index) => {
            console.log(`Корабль ${index + 1}: ${ship.locations.join(', ')}`);
        });
    }

    restartGame() {
        this.model = new GameModel();   
        this.view = new GameView();    

        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('hit', 'miss');
        });

        this.guesses = 0;
        this.startGame();
        this.createRestartButton();
    }

    processGuess(guess) {

        if (this.model.isGameOver()) {
            this.view.displayMessage("Игра окончена! Нажмите 'Начать заново'.");
            return;
        }

        this.guesses++;

        const result = this.model.fire(guess);

        if (result.hit) {
            this.view.displayHit(guess);
        } else {
            this.view.displayMiss(guess);
        }

        this.view.displayMessage(result.message);

        if (this.model.isGameOver()) {
            this.view.displayMessage(
                `🎉 Поздравляем! Вы потопили все корабли за ${this.guesses} выстрелов!`
            );

            const name = prompt("Хотите сохранить результат? Введите ваше имя:");
            if (name) {
                saveResult(name, this.guesses);
            }

        }
    }
}

// Сохраняем результат победителя
function saveResult(name, guesses) {
    const url = 'https://fe.it-academy.by/AjaxStringStorage2.php';
    const requestName = 'AnnaSalazhkova';

    const winnerData = {
        name: name,
        guess: guesses
    };

    let existingData;

    const readSuccessHandler = (data) => {
        console.log('read data', data)
        existingData = JSON.parse(JSON.parse(data).result);

        if (!existingData) {
            existingData = [];
        }

        const existingIndex = existingData.findIndex(item => item.name === name);

        if (existingIndex !== -1) {
            
            existingData[existingIndex] = winnerData;
        } else {
            existingData.push(winnerData);
        }

        updateResults(JSON.stringify(existingData));
    }


    const errorHandler = (jqXHR, statusStr, errorStr) => {
        console.error(statusStr + ' ' + errorStr);
    }

    $.ajax(url,
        {
            type: 'POST', dataType: 'text', data: { f: 'LOCKGET', n: requestName, p: 123 },
            success: readSuccessHandler, error: errorHandler
        }
    );
}

// Перезаписываем данные на бекенде
function updateResults(newData) {
    const url = 'https://fe.it-academy.by/AjaxStringStorage2.php';
    const requestName = 'AnnaSalazhkova';

    const updateSuccessHandler = (data) => {
        console.log('Update data', data)
    }

    const errorHandler = (jqXHR, statusStr, errorStr) => {
        console.error(statusStr + ' ' + errorStr);
    }

    $.ajax(url,
        {
            type: 'POST', dataType: 'text', data: { f: 'UPDATE', n: requestName, v: newData, p: 123 },
            success: updateSuccessHandler, error: errorHandler
        }
    );
}

// Получить данные по победителям от бекенда
function getResults() {
    const url = 'https://fe.it-academy.by/AjaxStringStorage2.php';
    const requestName = 'AnnaSalazhkova';

    const getSuccessHandler = (data) => {
        const existingData = JSON.parse(JSON.parse(data).result);

        existingData.sort((a, b) => a.guess - b.guess);

        const tbody = document.getElementById('scoresBody');
        tbody.innerHTML = existingData.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><i class="fas fa-user"></i> ${player.name}</td>
            <td>${player.guess}</td>
        </tr>
    `).join('');
    }

    const errorHandler = (jqXHR, statusStr, errorStr) => {
        console.error(statusStr + ' ' + errorStr);
    }

    $.ajax(url,
        {
            type: 'POST', dataType: 'text', data: { f: 'READ', n: requestName },
            success: getSuccessHandler, error: errorHandler
        }
    );
}

let currentGame;


function startBattleshipGame() {

    if (currentGame) {
        currentGame.restartGame();
    } else {
        currentGame = new GameController();
    }
}
