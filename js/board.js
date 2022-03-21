const generateBoard = (board, maxRows, maxColumns) => {
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
const generatePlayers = (
  state,
  board,
  playerCount,
  minPlayers,
  maxPlayers,
  availablePlayerColors
) => {
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
        ladderCollisionCount: 0,
        snakeCollisonCount: 0,
        totalSquaresMoved: 0,
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

const generateSnakes = (
  svg,
  svgns,
  snakePoint,
  maxRows,
  maxColumns,
  availableBoardPoints
) => {
  for (let i = 1; i <= snakePoint.limit; i++) {
    let startPoint = assignSnakeAndLadderPoint(
      1,
      maxRows * maxColumns - 1,
      availableBoardPoints
    );
    let endPoint = assignSnakeAndLadderPoint(
      1,
      maxRows * maxColumns,
      availableBoardPoints
    );
    if (endPoint < startPoint) {
      let temp = startPoint;
      startPoint = endPoint;
      endPoint = temp;
    }
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
      drawLine.setAttribute(
        "style",
        "stroke:rgb(255,0,0);stroke-width:2;fill:rgba(0,0,0,0);"
      );
      drawLine.setAttribute("marker-end", "url(#arrowhead-red)");
      svg.appendChild(drawLine);
    } catch (ex) {
      console.error(ex);
    }
  }
};

const generateLadders = (
  svg,
  svgns,
  ladderPoint,
  maxRows,
  maxColumns,
  availableBoardPoints
) => {
  for (let i = 1; i <= ladderPoint.limit; i++) {
    let startPoint = assignSnakeAndLadderPoint(
      1,
      maxRows * maxColumns - 1,
      availableBoardPoints
    );
    let endPoint = assignSnakeAndLadderPoint(
      1,
      maxRows * maxColumns,
      availableBoardPoints
    );
    if (endPoint < startPoint) {
      let temp = startPoint;
      startPoint = endPoint;
      endPoint = temp;
    }

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

const assignSnakeAndLadderPoint = (min = 1, max = 99, availableBoardPoints) => {
  const minIndex = availableBoardPoints.indexOf(min);
  const randIndex =
    Math.floor(Math.random() * (availableBoardPoints.length - minIndex)) +
    minIndex;
  let point = availableBoardPoints[randIndex];
  availableBoardPoints.splice(randIndex, 1);
  console.log(min, minIndex, randIndex, point);
  return point;
};

export { generateBoard, generatePlayers, generateSnakes, generateLadders };
