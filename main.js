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

const state = {
  currentPlayer: 0,
  diceResult: 0,
  players: [
    {
      id: 0,
      name: "Player 1",
      currentLocation: 0,
      ref: player1,
    },
    {
      id: 1,
      name: "Player 2",
      currentLocation: 0,
      ref: player2,
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

const generatePlayers = () => {
  if (playerCount <= maxPlayers && playerCount >= minPlayers) {
    state.players = [];
    for (let i = 0; i < playerCount; i++) {
      const player = document.createElement("div");
      const playerColor =
        availablePlayerColors[
          Math.floor(Math.random() * availablePlayerColors.length)
        ];
      player.id = `player${i}`;
      player.classList.add("player");
      player.textContent = `P${i + 1}`;
      player.style.position = "absolute";
      player.style.backgroundColor = playerColor;
      availablePlayerColors = availablePlayerColors.filter(
        (color) => color != playerColor
      );
      player.style.left = "-50px";
      player.style.bottom = `${10 * (i + 1)}px`;
      const playerInfo = {
        id: i,
        name: `Player ${i + 1}`,
        currentLocation: 0,
        domRef: player,
      };
      state.players.push(playerInfo);
      board.appendChild(player);
    }
  } else {
    console.info(
      `Minimum players: ${minPlayers}, Maximum Players: ${maxPlayers}`
    );
  }
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
  let point =
    availableBoardPoints[
      Math.floor(Math.random() * (availableBoardPoints.length - min + 1)) + min
    ];
  availableBoardPoints = availableBoardPoints.filter(
    (availableBoardPoint) => availableBoardPoint !== point
  );
  console.log(point);
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
      animatePlayerToTarget(player.domRef, targetSquare);
    }, 500);
  }
  if (isLadder) {
    console.info(`${player.name} is in ${isLadder.toString()}`);
    player.currentLocation = isLadder.endPoint;
    setTimeout(() => {
      const targetSquare = document.querySelector(
        `.square-${player.currentLocation}`
      );
      animatePlayerToTarget(player.domRef, targetSquare);
    }, 500);
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
  state.diceResult = rollDice();
  diceResult.textContent = `${state.players[state.currentPlayer].name}'s result: ${state.diceResult}`;
  for (let i = 0; i < state.players.length; i++) {
    if (state.currentPlayer === i) {
      if (!(state.players[i].currentLocation + state.diceResult > 100)) {
        btnDice.disabled = true;
        currentPlayerText.textContent = state.players[i].name;
        state.players[i].currentLocation =
          state.players[i].currentLocation + state.diceResult;
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
      currentPlayerText.textContent = state.players[state.currentPlayer].name;
      break;
    }
  }
};

const checkForWinner = (player) => {
  if (player.currentLocation === 100) {
    diceResult.textContent = `Result: Player ${player.name} Wins!!!`;
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
  generatePlayers();
};
