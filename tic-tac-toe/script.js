const init = () => {
  const $section_boardContainer = document.getElementById('board-container');
  const $button_start = document.getElementById('start');
  const $section_options = document.getElementById('options');
  const $div_alert = document.getElementById('alert');
  let winnerPath = [];
  let $boardElements = [[],[],[]];
  
  //options
  const winLength = 3;
  
  const deleteBoard = () => {
    document.getElementById('game-alert').remove();
    document.getElementById('board').remove();
  }
  
  const resetGame = e => {
    let quit_confirm = true;

    if (!hasWinner()) {
      quit_confirm = confirm('Are you sure you want to quit?');
    }

    if (quit_confirm) {
      $boardElements = [[], [], []];
      $section_options.classList.remove('display-none');
      e.target.remove();
      deleteBoard();
    }
  }

  const removeEventListeners = () => $boardElements.forEach(r => r.forEach(s => {
    if (s) s.removeEventListener("click", onClick_Square);
  }));
  
  const createNewBoard = () => {
    const $div_board = document.createElement('div');
    const $button_quit = document.createElement('button');
    const $div_gameAlert = document.createElement('div');
    $div_gameAlert.setAttribute('id', 'game-alert');
    $div_board.setAttribute('id', 'board');
    
    for (let a = 0; a < $boardElements.length; a++) {
      const row = document.createElement('div');
      row.setAttribute('id', `row-${a}`)
      $div_board.appendChild(row);

      for (let b = 0; b < 3; b++) {
        const square = document.createElement('div');
        square.addEventListener("click", onClick_Square);
        square.setAttribute("data-id", "0");
        square.classList.add("square");
        $boardElements[a].push(square);
        row.appendChild(square);
      }
    }

    $button_quit.setAttribute("id", "quit");
    $button_quit.innerText = "Quit";
    $button_quit.addEventListener("click", resetGame);
    $section_boardContainer.appendChild($div_gameAlert);
    $section_boardContainer.appendChild($div_board);
    $section_boardContainer.appendChild($button_quit);
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
      let dirPath = [];

      const getDirs = () => {
        dirArr.forEach(f => {
          const pos = f([x, y]);
          if ($boardElements?.[pos[0]]?.[pos[1]]) {
            tryDir.push(f);
          }
        });
      }
      getDirs();
      
      while(tryDir.length > 0) {
        let currentPos = tryDir[0]([x, y]);

        for (let i = 0; i < winLength - 1; i++) {
          const ele = $boardElements?.[currentPos[0]]?.[currentPos[1]];
          
          if (!ele) continue;

          if (ele.getAttribute("data-id") === dataID) {
            dirPath.push(currentPos);
            count++;
            currentPos = tryDir[0]([currentPos[0], currentPos[1]]);
          }  
        }

        if (count === winLength) {
          winnerPath = [];
          winnerPath.push([x, y]);
          dirPath.forEach(p => winnerPath.push(p));
          console.log(`winnerPath: ${winnerPath}`)
          return true;
        }

        dirPath = [];
        count = 1;
        tryDir.shift();
      }

      return false;
    }

    for (let a = 0; a < $boardElements.length; a++) {
      for (let b = 0; b < $boardElements.length; b++) {
        const dataID = $boardElements[a][b].getAttribute('data-id');

        if (dataID !== '0' && isInline(a, b, dataID)) {
          winner = dataID;
          break;
        }
        
        switch (dataID) {
          case "1" : xAmount++; break;
          case "2" : oAmount++; break;
        }
      }
    }

    if (xAmount + oAmount === 9) winner = "0";

    return winner;
  }

  const setDataID = (ele, sign) => ele.setAttribute('data-id', sign);

  //get random empty element and mark it
  const computerMove = () => {
    const empties = [];
    let pos;

    for (let a = 0; a < $boardElements.length; a++) {
      for (let b = 0; b < $boardElements[a].length; b++ ) {
        if ($boardElements[a][b].getAttribute("data-id") === "0") empties.push([a, b]);
      }
    }

    if (empties.length > 0) {
      const shuffledEmpties = empties
      .map(pos => ({ pos, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ pos }) => pos);
      pos = shuffledEmpties[0];
      $boardElements[pos[0]][pos[1]].removeEventListener("click", onClick_Square);
      setDataID($boardElements[pos[0]][pos[1]], 2);
    }
  }

  const onClick_Square = (e) => {
    e.target.removeEventListener("click", onClick_Square);
    setDataID(e.target, 1);

      // Call hasWinner for each move
      if (!hasWinner()) computerMove();

      const winner = hasWinner();
      if (winner) {
        gameOver(winner);
      }
  }

  const highlightPath = () => {
    console.log(winnerPath)
      winnerPath.forEach(i => {
      $boardElements[i[0]][i[1]].classList.add('winner-path')
    })
  }

  const gameOver = (winner) => {
    const $div_gameAlert = document.getElementById('game-alert');

    switch (winner) {
      case "0" : $div_gameAlert.innerText = "The game has ended in a tie."; break;
      case "1" : $div_gameAlert.innerText = "You win!"; break;
      case "2" : $div_gameAlert.innerText = "You lose.";
    } 
    removeEventListeners();
    highlightPath();
  }


  $button_start.addEventListener("click", () => {
    $section_options.classList.add("display-none");
    createNewBoard();
  })
}

init();