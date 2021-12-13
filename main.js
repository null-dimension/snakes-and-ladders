const rootDiv = document.querySelector("#root");
const board = document.querySelector("#board");
const btnDice = document.querySelector("#btn-dice");
const diceResult = document.querySelector("#dice-result");
const currentPlayer = document.querySelector("#current-player");
const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const svg = document.querySelector("svg");
const svgns = "http://www.w3.org/2000/svg";

const maxColumns = 10;
const maxRows = 10;
const state = {
  currentPlayer: 1,
  player1: {
    currentLocation: 1,
  },
  player2: {
    currentLocation: 1,
  },
  diceResult: 1,
};
const snakePoint = {
  limit: 5,
  points: [],
};
const ladderPoint = {
  limit: 5,
  points: [],
};

const generateBoard = () => {
  for (let i = maxRows; i >= 1; i--) {
    for (let j = 1; j <= maxColumns; j++) {
      const square = document.createElement("div");
      const number = document.createElement("div");
      square.classList.add("square");

      if (i % 2 === 0) {
        number.textContent = `${i * 10 - j + 1}`;
        square.classList.add(`square-${i * 10 - j + 1}`);
      } else {
        number.textContent = `${i * 10 - 9 + j - 1}`;
        square.classList.add(`square-${i * 10 - 9 + j - 1}`);
      }

      square.appendChild(number);
      board.appendChild(square);
    }
  }



  // DEBUG ONLY!
  // let newLine = document.createElementNS(svgns, "line");
  // let square80 = document.querySelector(".square-2"); //.getBoundingClientRect();
  // let boardPoints = board.getBoundingClientRect();
  // console.log(square80);
  // console.log(boardPoints);
  // newLine.setAttribute("x1", square80.offsetLeft + square80.offsetWidth / 2);
  // newLine.setAttribute("y1", square80.offsetTop + square80.offsetHeight / 2);
  // newLine.setAttribute("x2", "10");
  // newLine.setAttribute("y2", "10");
  // newLine.setAttribute("style", "stroke:rgb(255,0,0);stroke-width:2");
  // svg.appendChild(newLine);
};

const generateSnakes = () => {
  for (let i = 1; i <= snakePoint.limit; i++) {
    const startPoint = assignSnakeAndLadderPoint(1, maxRows * maxColumns - 1);
    const endPoint = assignSnakeAndLadderPoint(startPoint, maxRows * maxColumns);
    try {
      const startSquare = document.querySelector(`.square-${startPoint}`);
      const endSquare = document.querySelector(`.square-${endPoint}`);

      snakePoint.points.push({startSquare, endSquare});

      const drawLine = document.createElementNS(svgns, "line");
      drawLine.setAttribute(
        "x2",
        startSquare.offsetLeft + startSquare.offsetWidth / 2
      );
      drawLine.setAttribute(
        "y2",
        startSquare.offsetTop + startSquare.offsetHeight / 2
      );
      drawLine.setAttribute(
        "x1",
        endSquare.offsetLeft + endSquare.offsetWidth / 2
      );
      drawLine.setAttribute(
        "y1",
        endSquare.offsetTop + endSquare.offsetHeight / 2
      );
      drawLine.setAttribute("style", "stroke:rgb(255,0,0);stroke-width:2");
      drawLine.setAttribute("marker-end", "url(#arrowhead)");
      svg.appendChild(drawLine);
    } catch (ex) {
      console.error(ex);
    }
  }
};

const generateLadders = () => {};

const rollDice = (min = 1, max = 6) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const assignSnakeAndLadderPoint = (min = 1, max = 99) => {
  let point =  Math.floor(Math.random() * (max - min + 1)) + min;
  if(point === min && point < maxRows * maxColumns) {
    point += 1;
  }
  return point;
};

btnDice.addEventListener("click", (e) => {
  state.diceResult = rollDice();
  if (state.currentPlayer === 1) {
    if (!(state.player1.currentLocation + state.diceResult > 100)) {
      state.player1.currentLocation =
        state.player1.currentLocation + state.diceResult;
      console.log(player1);
      document
        .querySelector(`.square-${state.player1.currentLocation}`)
        .appendChild(player1);
      player1.style.position = "absolute";
    }
    state.currentPlayer = 2;
  } else if (state.currentPlayer === 2) {
    if (!(state.player2.currentLocation + state.diceResult > 100)) {
      state.player2.currentLocation =
        state.player2.currentLocation + state.diceResult;
      document
        .querySelector(`.square-${state.player2.currentLocation}`)
        .appendChild(player2);
      player2.style.position = "absolute";
    }

    state.currentPlayer = 1;
  }
  diceResult.textContent = `Result: ${rollDice()}`;
  currentPlayer.textContent = state.currentPlayer;

  if (state.player1.currentLocation === 100) {
    diceResult.textContent = `Result: Player 1 Wins!!!`;
    btnDice.disabled = true;
  } else if (state.player2.currentLocation === 100) {
    diceResult.textContent = `Result: Player 2 Wins!!!`;
    btnDice.disabled = true;
  }

  console.log(state);
});
window.onload = () => {
  generateBoard();
  generateSnakes();
};
