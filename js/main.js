import {
  generateBoard,
  generatePlayers,
  generateSnakes,
  generateLadders,
} from "./board.js";

const rootDiv = document.querySelector("#root");
const board = document.querySelector("#board");
const btnDice = document.querySelector("#btn-dice");
const diceResult = document.querySelector("#dice-result");
const currentPlayerText = document.querySelector("#current-player");
const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const svg = document.querySelector("svg");
const svgns = "http://www.w3.org/2000/svg";

const maxColumns = 10;
const maxRows = 10;
let totalTurns = 0;

const state = {
  currentPlayer: 0,
  diceResult: 0,
  players: [
    {
      id: 0,
      name: "Player 1",
      currentLocation: 0,
      ref: player1,
      ladderCollisionCount: 0,
      snakeCollisonCount: 0,
      totalSquaresMoved: 0,
    },
    {
      id: 1,
      name: "Player 2",
      currentLocation: 0,
      ref: player2,
      ladderCollisionCount: 0,
      snakeCollisonCount: 0,
      totalSquaresMoved: 0,
    },
  ],
};
const snakePoint = {
  limit: 5,
  points: [],
};
const ladderPoint = {
  limit: 5,
  points: [],
};

let availableBoardPoints = [];
for (let i = 1; i <= maxRows * maxColumns - 1; i++) {
  availableBoardPoints.push(i);
}

const minPlayers = 2;
const maxPlayers = 5;
let availablePlayerColors = ["red", "green", "blue", "cyan", "black"];
let playerCount = 2;

let isAiMode = true;
let isAutoMode = false;



const diceLog = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
};

const rollDice = (min = 1, max = 6, type) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const checkCurrentPosition = (player) => {
  const isSnake = snakePoint.points.find(
    (snake) => snake.endPoint === player.currentLocation
  );
  const isLadder = ladderPoint.points.find(
    (ladder) => ladder.startPoint === player.currentLocation
  );
  if (isSnake) {
    console.info(`${player.name} is in ${isSnake}`);
    player.currentLocation = isSnake.startPoint;
    player.snakeCollisonCount++;
    setTimeout(() => {
      const targetSquare = document.querySelector(
        `.square-${player.currentLocation}`
      );
      animatePlayerToTarget(player.domRef, targetSquare);
    }, 500);
  }
  if (isLadder) {
    console.info(`${player.name} is in ${isLadder.toString()}`);
    player.currentLocation = isLadder.endPoint;
    player.ladderCollisionCount++;
    setTimeout(() => {
      const targetSquare = document.querySelector(
        `.square-${player.currentLocation}`
      );
      animatePlayerToTarget(player.domRef, targetSquare);
    }, 500);
  }
};
const animatePlayerToTarget = (player, target) => {
  try {
    player.style.left = `${
      target.offsetLeft + target.offsetWidth / 2 - player.offsetWidth / 2
    }px`;
    player.style.top = `${
      target.offsetTop + target.offsetHeight / 2 - player.offsetHeight / 2
    }px`;
  } catch (ex) {
    console.error(ex);
  }
};
const movePlayer = () => {
  state.diceResult = rollDice();
  diceResult.textContent = `${
    state.players[state.currentPlayer].name
  }'s result: ${state.diceResult}`;
  diceLog[state.diceResult]++;
  for (let i = 0; i < state.players.length; i++) {
    if (state.currentPlayer === i) {
      totalTurns++;
      if (!(state.players[i].currentLocation + state.diceResult > 100)) {
        btnDice.disabled = true;
        currentPlayerText.textContent = state.players[i].name;
        state.players[i].currentLocation =
          state.players[i].currentLocation + state.diceResult;
        state.players[i].totalSquaresMoved++;
        const targetSquare = document.querySelector(
          `.square-${state.players[i].currentLocation}`
        );
        setTimeout(() => {
          animatePlayerToTarget(state.players[i].domRef, targetSquare);
          checkCurrentPosition(state.players[i]);
          btnDice.disabled = false;
          checkForWinner(state.players[i]);
        }, 300);
      }
      
      if (state.currentPlayer < state.players.length - 1) {
        state.currentPlayer = i + 1;
      } else {
        state.currentPlayer = 0;
      }
      setTimeout(()=>{
        currentPlayerText.textContent = state.players[state.currentPlayer].name;
      }, 500);
      if (isAiMode && state.currentPlayer !== 0) {
        setTimeout(() => {
          aiMove();
        }, 500);
      }
      if (isAutoMode) {
        setTimeout(() => {
          aiMove();
        }, 500);
      }
      break;
    }
  }
};

const aiMove = () => {
  btnDice.click();
};

const checkForWinner = (player) => {
  if (player.currentLocation === 100) {
    diceResult.innerHTML = `Result: Player ${player.name} Wins!!!<br/>Total turns: ${totalTurns}`;
    btnDice.disabled = true;
  }
};

btnDice.addEventListener("click", (e) => {
  movePlayer();
  console.log(totalTurns);
});

window.onload = () => {
  
  if(localStorage.getItem('player_count')) {
    if(localStorage.getItem('player_count') <= maxPlayers) {
      playerCount = localStorage.getItem('player_count');
    }
  }
  if(localStorage.getItem('play_type')) {
    if(localStorage.getItem('play_type') === 'play_auto') {
      isAutoMode = true;
      isAiMode = false;
    } else if(localStorage.getItem('play_type') === 'play_ai') {
      isAiMode = true;
      isAutoMode = false;
    } else if(localStorage.getItem('play_type') === 'play_human') {
      isAutoMode = false;
      isAiMode = false;
    }
  }
  generateBoard(board, maxRows, maxColumns);
  generatePlayers(
    state,
    board,
    playerCount,
    minPlayers,
    maxPlayers,
    availablePlayerColors
  );

  generateSnakes(
    svg,
    svgns,
    snakePoint,
    maxRows,
    maxColumns,
    availableBoardPoints
  );

  generateLadders(
    svg,
    svgns,
    ladderPoint,
    maxRows,
    maxColumns,
    availableBoardPoints
  );
};
