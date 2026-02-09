const renderScore = () => {
    return `
    <div id="scoreBoard">
        <h2>🏅 Таблица победителей</h2>
            <div class="table-container">
        <table id="highScoresTable">
            <thead>
                <tr>
                    <th>Место</th>
                    <th>Имя капитана</th>
                    <th>Выстрелы</th>
                </tr>
            </thead>
            <tbody id="scoresBody">
                <!--  через JS -->
            </tbody>
        </table>
        </div>
    </div>
`
}