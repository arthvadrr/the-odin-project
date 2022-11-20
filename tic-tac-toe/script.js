const init = () => {
  const container = document.getElementById('board-container');
  const boardElements = [[],[],[]];
  let playerSign = 1;
  let computerSign = 2;
  
  //options
  const winLength = 3;

  const deleteBoard = () => document.getElementById('board').remove();

  const createNewBoard = () => {
    const board = document.createElement('div');
    board.setAttribute('id', 'board');
    
    for (let a = 0; a < boardElements.length; a++) {
      const row = document.createElement('div');
      row.setAttribute('id', `row-${a}`)
      board.appendChild(row);

      for (let b = 0; b < 3; b++) {
        const square = document.createElement('div');
        square.setAttribute("data-id", "0");
        square.classList.add("square");
        boardElements[a].push(square);
        row.appendChild(square);
      }
    }

    container.appendChild(board)
  }

  const hasWinner = () => {
    let winner = 0;
    let xAmount = 0;
    let oAmount = 0;
    
    const up        = ([x, y]) => [x - 1, y];
    const down      = ([x, y]) => [x + 1, y];
    const left      = ([x, y]) => [x, y - 1];
    const right     = ([x, y]) => [x, y + 1];
    const upRight   = ([x, y]) => [x - 1, y + 1];
    const upLeft    = ([x, y]) => [x - 1, y - 1];
    const downLeft  = ([x, y]) => [x + 1, y - 1];
    const downRight = ([x, y]) => [x + 1, y + 1];
    const dirArr = [up, upRight, right, downRight, down, downLeft, left, upLeft];
    
    const isInline = (x, y, dataID) => {
      const tryDir = [];
      let count = 1;

      const getDirs = () => {
        dirArr.forEach(f => {
          const pos = f([x, y]);
          if (boardElements?.[pos[0]]?.[pos[1]]) {
            tryDir.push(f);
          }
        });
      }
      getDirs();
      
      while(tryDir.length > 0) {
        let currentPos = tryDir[0]([x, y]);

        for (let i = 0; i < winLength - 1; i++) {
          if (boardElements?.[currentPos[0]]?.[currentPos[1]].getAttribute("data-id") === dataID) {
            count++;
            currentPos = tryDir[0]([currentPos[0], currentPos[1]]);
          }  
        }

        if (count === winLength) return true;
        count = 1;
        tryDir.shift();
      }

      return false;
    }

    for (let a = 0; a < boardElements.length; a++) {
      for (let b = 0; b < boardElements.length; b++) {
        const dataID = boardElements[a][b].getAttribute('data-id');

        if (dataID !== '0' && isInline(a, b, dataID)) {
          winner = dataID;
          break;
        }
        
        switch (dataID) {
          case "1" : xAmount++; break;
          case "2" : oAmount++; break;
        }
        //TODO Check if board is full
      }
    }

    return winner;
  }

  const setDataID = (ele, sign) => ele.setAttribute('data-id', sign);

  const computerMove = e => {
    const empties = [];
    let pos;

    for (let a = 0; a < boardElements.length; a++) {
      for (let b = 0; b < boardElements[a].length; b++ ) {
        if (boardElements[a][b].getAttribute("data-id") === "0") empties.push([a, b]);
      }
    }

    const shuffledEmpties = empties
    .map(pos => ({ pos, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ pos }) => pos);
    
    pos = shuffledEmpties[0];
    setDataID(boardElements[pos[0]][pos[1]]);
  }
  
  const onClick_Square = (e) => {
    setDataID(e.target, playerSign);
    computerMove(e);
  }

  createNewBoard();
  console.log(hasWinner());
}

init();