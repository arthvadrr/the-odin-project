const init = () => {
  const container = document.getElementById('board-container');
  const boardElements = [[],[],[]];

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

    const up = ([x, y]) => [x - 1, y];
    const down = ([x, y]) => [x + 1, y];
    const left = ([x, y]) => [x, y - 1];
    const right = ([x, y]) => []

    for (let a = 0; a < boardElements.length; a++) {
      for (let b = 0; b < boardElements.length; b++) {

      }
    }

    return winner;
  }

  createNewBoard();

  console.log('hi')
}

init();