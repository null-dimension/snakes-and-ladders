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
    name: "Player 1",
    currentLocation: 0,
    ref: player1,
  },
  player2: {
    name: "Player 2",
    currentLocation: 0,
    ref: player2,
  },
  diceResult: 0,
  isPlayerMoving: true,
  players: [
    {
      id: 1,
      name: "Player 1",
      currentLocation: 1,
    },
    {
      id: 2,
      name: "Player 2",
      currentLocation: 1,
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
  board.appendChild(player1);
  board.appendChild(player2);
};

const generateSnakes = () => {
  for (let i = 1; i <= snakePoint.limit; i++) {
    const startPoint = assignSnakeAndLadderPoint(1, maxRows * maxColumns - 1);
    const endPoint = assignSnakeAndLadderPoint(
      startPoint,
      maxRows * maxColumns
    );
    try {
      const startSquare = document.querySelector(`.square-${startPoint}`);
      const endSquare = document.querySelector(`.square-${endPoint}`);

      snakePoint.points.push({ startPoint, endPoint });

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
      drawLine.setAttribute("marker-end", "url(#arrowhead-red)");
      svg.appendChild(drawLine);
    } catch (ex) {
      console.error(ex);
    }
  }
};

const generateLadders = () => {
  for (let i = 1; i <= ladderPoint.limit; i++) {
    let startPoint = assignSnakeAndLadderPoint(1, maxRows * maxColumns - 1);
    const endPoint = assignSnakeAndLadderPoint(
      startPoint,
      maxRows * maxColumns
    );

    try {
      const startSquare = document.querySelector(`.square-${startPoint}`);
      const endSquare = document.querySelector(`.square-${endPoint}`);

      ladderPoint.points.push({ startPoint, endPoint });

      const drawLine = document.createElementNS(svgns, "line");
      drawLine.setAttribute(
        "x1",
        startSquare.offsetLeft + startSquare.offsetWidth / 2
      );
      drawLine.setAttribute(
        "y1",
        startSquare.offsetTop + startSquare.offsetHeight / 2
      );
      drawLine.setAttribute(
        "x2",
        endSquare.offsetLeft + endSquare.offsetWidth / 2
      );
      drawLine.setAttribute(
        "y2",
        endSquare.offsetTop + endSquare.offsetHeight / 2
      );
      drawLine.setAttribute("style", "stroke:rgb(0,255,0);stroke-width:2");
      drawLine.setAttribute("marker-end", "url(#arrowhead-green)");
      svg.appendChild(drawLine);
    } catch (ex) {
      console.error(ex);
    }
  }
};

const rollDice = (min = 1, max = 6, type) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const assignSnakeAndLadderPoint = (min = 1, max = 99) => {
  let point = Math.floor(Math.random() * (max - min + 1)) + min;
  if (point === min && point < maxRows * maxColumns - 1) {
    point += 1;
  } else if (point === maxRows * maxColumns) {
    point -= 1;
  }
  return point;
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
    setTimeout(() => {
      const targetSquare = document.querySelector(
        `.square-${player.currentLocation}`
      );
      animatePlayerToTarget(player.ref, targetSquare);
    }, 250);
  }
  if (isLadder) {
    console.info(`${player.name} is in ${isLadder.toString()}`);
    player.currentLocation = isLadder.endPoint;
    setTimeout(() => {
      const targetSquare = document.querySelector(
        `.square-${player.currentLocation}`
      );
      animatePlayerToTarget(player.ref, targetSquare);
    }, 250);
  }
};
const animatePlayerToTarget = (player, target) => {
  player.style.left = `${
    target.offsetLeft + target.offsetWidth / 2 - player.offsetWidth / 2
  }px`;
  player.style.top = `${
    target.offsetTop + target.offsetHeight / 2 - player.offsetHeight / 2
  }px`;
};
const movePlayer = () => {
  btnDice.disabled = true;
  state.diceResult = rollDice();

  if (state.currentPlayer === 1) {
    if (!(state.player1.currentLocation + state.diceResult > 100)) {
      state.player1.currentLocation =
        state.player1.currentLocation + state.diceResult;
      const targetSquare = document.querySelector(
        `.square-${state.player1.currentLocation}`
      );
      animatePlayerToTarget(player1, targetSquare);
      checkCurrentPosition(state.player1);
    }
    state.currentPlayer = 2;
  } else if (state.currentPlayer === 2) {
    if (!(state.player2.currentLocation + state.diceResult > 100)) {
      state.player2.currentLocation =
        state.player2.currentLocation + state.diceResult;
      const targetSquare = document.querySelector(
        `.square-${state.player2.currentLocation}`
      );
      animatePlayerToTarget(player2, targetSquare);
      checkCurrentPosition(state.player2);
    }

    state.currentPlayer = 1;
  }
  diceResult.textContent = `Result: ${state.diceResult}`;
  currentPlayer.textContent = state.currentPlayer;
  state.isPlayerMoving = false;
  btnDice.disabled = false;
  state.diceResult = 0;
  checkForWinner();
};

const checkForWinner = () => {
  if (state.player1.currentLocation === 100) {
    diceResult.textContent = `Result: Player 1 Wins!!!`;
    btnDice.disabled = true;
  } else if (state.player2.currentLocation === 100) {
    diceResult.textContent = `Result: Player 2 Wins!!!`;
    btnDice.disabled = true;
  }
};

btnDice.addEventListener("click", (e) => {
  movePlayer();
  console.log(state);
});
window.onload = () => {
  generateBoard();
  generateSnakes();
  generateLadders();
};
