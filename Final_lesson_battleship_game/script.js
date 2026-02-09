"use strict";

window.onhashchange = switchToStateFromURLHash;

let SPAState = {};

function switchToStateFromURLHash() {
    const URLHash = window.location.hash;
    const stateStr = URLHash.substr(1);
    if (stateStr != "") {
        SPAState = {
            pagename: stateStr
        };
    } else {
        SPAState = {
            pagename: 'Main'
        };
    }

    let pageHTML = "";
    switch (SPAState.pagename) {
        case 'Main':
            pageHTML += renderMain();
            break;
        case 'Game':
            pageHTML += renderGame();
            break;
        case 'Winners':
            pageHTML += renderScore();
            break;
        case 'Rules':
            pageHTML += renderRules();
            break;
    }
    document.getElementById('IPage').innerHTML = pageHTML;

    if (SPAState.pagename === 'Game') {
        startBattleshipGame();
    }

    if (SPAState.pagename === 'Winners') {
        getResults();
    }
}

function switchToState(newState) {
    location.hash = newState.pagename;
}

function switchToMainPage() {
    switchToState({
        pagename: 'Main'
    });
}

function switchToGamePage() {
    switchToState({
        pagename: 'Game'
    });
}

function switchToScorePage() {
    switchToState({
        pagename: 'Winners'
    });
}

function switchToRulesPage() {
    switchToState({
        pagename: 'Rules'
    });
}

switchToStateFromURLHash();
