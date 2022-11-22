const init = () => {
  const $section_boardContainer = document.getElementById('board-container');
  const $button_start = document.getElementById('start');
  const $section_options = document.getElementById('options');
  const $input_difficulty = document.getElementById('difficulty');
  const $input_markers = document.querySelectorAll('input[name="marker"]');
  const $input_type = document.querySelectorAll('input[name="type"]');
  const $input_boardSize = document.getElementById('board-size');
  const $settings_fieldset = document.querySelector('.settings-fieldset');

  let winnerPath = [];
  let difficulty = 1;
  let boardSize = 3;
  let winLength = 3;
  let currentLevel = 1;
  let gameType = 0;
  let lives = 3;
  let $boardElements;

  // fix for input caching
  $input_boardSize.value = "3";
  $input_difficulty.value = difficulty.toString();

  const oninput_changeType = () => {
    gameType = document.querySelector('input[name="type"]:checked').value;
    console.log(gameType);
    
    if (gameType === "classic") {
      $settings_fieldset.classList.remove('display-none');
    } else {
      $settings_fieldset.classList.add('display-none');
    }
  }
  oninput_changeType();

  const oninput_changeBoardSize = () => {
    const $span_boardSizeText = document.getElementById("board-size-text");
    const $span_amountToWin = document.getElementById("amount-to-win");
    const val = $input_boardSize.value;
    $span_boardSizeText.innerText = `${val}x${val}`;
    boardSize = parseInt(val);
    
    switch (val) {
      case "3": $span_amountToWin.innerText = "3"; winLength = 3; break;
      case "4": $span_amountToWin.innerText = "4"; winLength = 4; break;
      case "5": $span_amountToWin.innerText = "5"; winLength = 5; break;
      case "6": $span_amountToWin.innerText = "5"; winLength = 5; break;
      case "7": $span_amountToWin.innerText = "6"; winLength = 6; break;
      case "8": $span_amountToWin.innerText = "6"; winLength = 6; break;
      case "9": $span_amountToWin.innerText = "7"; winLength = 7; break;
    }
  }
  oninput_changeBoardSize();

  const oninput_changeMarker = () => {
    if (document.getElementById("marker-style")) document.getElementById("marker-style").remove(); 

    const $main = document.querySelector('main');
    let $checked = document.querySelector('input[name="marker"]:checked');

    if (!$checked) {
      $checked = document.getElementById('marker');
      $checked.checked = true;
    }

    const $style = document.createElement("style");
    $style.setAttribute("id", "marker-style");
    $style.innerText = `.square[data-id='1']:before {content: '${$checked.value}' !important}`;
    $main.prepend($style);
  }

  const oninput_changeDifficulty = () => {
    const $span_difficultySetting = document.getElementById("difficulty-setting");
    const val = $input_difficulty.value;
    difficulty = parseInt(val);
    
    switch (val) {
      case "1": $span_difficultySetting.innerText = "Normal"; break;
      case "2": $span_difficultySetting.innerText = "Hard"; break;
      case "3": $span_difficultySetting.innerText = "Insane"; break;
    }
  }

  const deleteBoard = () => {
    const arr = [
      document.getElementById('game-alert'),
      document.getElementById('board'),
      document.getElementById('quit'),
      document.getElementById('next-level'),
      document.getElementById('level-view'),
      document.getElementById('life-bar')
    ];

    arr.forEach(e => {if (e) e.remove()});
  }
  
  const resetGame = e => {
    let quit_confirm = true;

    if (!hasWinner()) {
      quit_confirm = confirm('Are you sure you want to quit?');
    }

    if (quit_confirm) {
      $boardElements = [];
      difficulty = 1;
      boardSize = 3;
      winLength = 3;
      lives = 3;
      currentLevel = 1;
      $section_options.classList.remove('display-none');
      e.target.remove();
      deleteBoard();
    }
  }

  const removeEventListeners = () => $boardElements.forEach(r => r.forEach(s => {
    if (s) s.removeEventListener("click", onClick_Square);
  }));
  
  const createNewBoard = (nextLevel) => {
    $boardElements = [];
    oninput_changeMarker();

    if (gameType === "progressive" && currentLevel === 1) {
      boardSize = 3;
      difficulty = 1;
      winLength = 3;
    }

    const $div_board = document.createElement('div');
    const $button_quit = document.createElement('button');
    const $div_gameAlert = document.createElement('div');
    const $button_nextLevel = document.createElement('button');
    const $span_levelView = document.createElement('span');
    
    //Progressive mode board addons
    if (gameType === "progressive") {
      const $div_lifeBar = document.createElement('div');
      $div_lifeBar.setAttribute('id', 'life-bar');

      // Add life bar
      for (let i = 0; i < lives; i++) {
        const $div_life = document.createElement('div');
        $div_life.classList.add('life');
        $div_lifeBar.appendChild($div_life);
      }

      $section_boardContainer.appendChild($div_lifeBar);
      $span_levelView.textContent = `Level ${currentLevel}`;
    }

    $span_levelView.setAttribute('id', 'level-view');
    $button_nextLevel.addEventListener("click", startNextLevel);
    $button_quit.addEventListener("click", resetGame);

    //adjust difficulty for board size
    if (gameType === 'progressive') {
      switch (currentLevel) {
        case 2: boardSize = 4; difficulty = 1; winLength = 3; break;
        case 3: boardSize = 5; difficulty = 1; winLength = 4; break;
        case 4: boardSize = 4; difficulty = 1; winLength = 4; break;
        case 5: boardSize = 5; difficulty = 2; winLength = 4; break;
        case 6: boardSize = 3; difficulty = 2; winLength = 3; break;
        case 7: boardSize = 4; difficulty = 2; winLength = 3; break;
        case 8: boardSize = 5; difficulty = 3; winLength = 3; break;
        case 9: boardSize = 6; difficulty = 3; winLength = 5; break;
        case 10: alert ('you win!');
      }
    }

    $div_board.classList.add(`board-size-${boardSize}`);

    $button_nextLevel.setAttribute('id', 'next-level');
    $div_gameAlert.setAttribute('id', 'game-alert');
    $div_board.setAttribute('id', 'board');
    $button_nextLevel.innerText = "Next level";
    $button_nextLevel.classList.add("display-none");
    $button_quit.innerText = "Quit";
    $div_gameAlert.innerHTML = `Get <span class='win-length'>${winLength}</span> in a row to win.`;

    switch (boardSize) {
      case 4: difficulty = difficulty + 1; break;
      case 5: difficulty = difficulty + 1; break;
      case 6: difficulty = difficulty + 2; break;
      case 7: difficulty = difficulty + 2; break;
      case 8: difficulty = difficulty + 3; break;
      case 9: difficulty = difficulty + 4; break;
    }


    for (let a = 0; a < boardSize; a++) {
      const row = document.createElement('div');
      const matrixRow = [];
      row.setAttribute('id', `row-${a}`)
      $div_board.appendChild(row);

      for (let b = 0; b < boardSize; b++) {
        const square = document.createElement('div');
        square.addEventListener("click", onClick_Square);
        square.setAttribute("data-id", "0");
        square.classList.add("square");
        matrixRow.push(square);
        row.appendChild(square);
      }
      $boardElements.push(matrixRow);
    }

    $button_quit.setAttribute("id", "quit");
    $section_boardContainer.appendChild($span_levelView);
    $section_boardContainer.appendChild($div_gameAlert);
    $section_boardContainer.appendChild($div_board);
    $section_boardContainer.appendChild($button_quit);
    $section_boardContainer.appendChild($button_nextLevel);
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
  
    if (xAmount + oAmount === (boardSize * boardSize)) winner = "0";

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
      if (!hasWinner()) {
        for (let i = 0; i < difficulty; i++) {
          computerMove();
        }
      }

      const winner = hasWinner();
      if (winner) {
        gameOver(winner);
      }
  }

  const highlightPath = () => {
    if (hasWinner() !== "0") {
        winnerPath.forEach(i => {
        $boardElements[i[0]][i[1]].classList.add('winner-path')
      });
    }
  }

  const gameOver = (winner) => {
    const $div_gameAlert = document.getElementById('game-alert');
    const $button_nextLevel = document.getElementById('next-level');

    switch (winner) {
      case "0" : 
        $div_gameAlert.innerText = "Tie game.";
        $button_nextLevel.classList.add('try-again');
        $button_nextLevel.textContent = "Tie game, replay level." 
        $button_nextLevel.classList.remove('display-none'); 
        break;
      case "1" :
        $div_gameAlert.classList.add('win'); 
        $div_gameAlert.innerText = "You win!";
        if (gameType === "progressive") $button_nextLevel.classList.remove('display-none'); 
        break;
      case "2" : {
        if (gameType === "progressive") {
          const $div_lifeBar = document.getElementById('life-bar');
          lives--;

          if ($div_lifeBar.hasChildNodes()) {
            $div_lifeBar.children[lives].classList.add('empty');
          }
        }

        if (lives > 0) {
          if (currentLevel > 1) {
            currentLevel -= 2;
          } else {
            $button_nextLevel.textContent = "Continue from previous level."             
          }

          $button_nextLevel.textContent = "Try again." 
          $button_nextLevel.classList.remove('display-none'); 
        } else {
        $div_gameAlert.classList.add('loss');
          if (gameType === "progressive") {
            $div_gameAlert.innerText = "No lives left. You lose."
            lives = 3;
          } else {
            $div_gameAlert.innerText = "You lose."
          }
        }
      };
    } 

    removeEventListeners();
    highlightPath();
  }

  const startNextLevel = () => {
    const $button_nextLevel = document.getElementById('next-level');

    if ($button_nextLevel) {
      $button_nextLevel.classList.remove('try-again');
    }

    if (hasWinner() !== "0") {
      currentLevel++;
    } else {
      document.getElementById('next-level').innerText = "Tie. try level again.";
    }


    $boardElements = [];
    $section_options.classList.remove('display-none');
    $section_options.classList.add("display-none");
    deleteBoard();
    createNewBoard();
  }

  //TODO create next level!


  $button_start.addEventListener("click", () => {
    //bugs? idk
    oninput_changeBoardSize();
    oninput_changeDifficulty();

    $section_options.classList.add("display-none");
    createNewBoard();
  });

  $input_difficulty.addEventListener("input", oninput_changeDifficulty);
  $input_type.forEach(e => e.addEventListener("input", oninput_changeType));
  $input_markers.forEach(e => e.addEventListener("input", oninput_changeMarker))
  $input_boardSize.addEventListener("input", oninput_changeBoardSize);
}

init();