document.addEventListener("DOMContentLoaded", () => {

  const grid = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));

  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;

  //The Tetrominoes
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]
  ]

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1]
  ]

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;

  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // draw the tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
    })
  }

  // undraw the tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
    })
  }

  // make the teromino move down every second
  // only needed to be called on button click
  // timerId = setInterval(moveDown, 1000);

  // assign functions to keyCodes
  function control(e) {
    if(e.keyCode === 37){
      moveLeft();
    } else if(e.keyCode === 38){
      rotate();
    } else if(e.keyCode === 39){
      moveRight();
    } else if(e.keyCode === 40){
      moveDown();
    }
  }

  document.addEventListener('keyup', control);

  // move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // freeze function
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      // start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0);

    if(!isAtLeftEdge) currentPosition -= 1;

    // to stop the tetromino from moving left, if there is already a tetromino present there
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition += 1;
    }
    draw();
  }

   // move the tetromino right, unless is at the edge or there is a blockage
   function moveRight() {
    undraw();
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1);

    if(!isAtRightEdge) currentPosition += 1;

    // to stop the tetromino from moving right, if there is already a tetromino present there
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -= 1;
    }
    draw();
  }

  // rotate the tetromino on arrow up key
  function rotate() {
    undraw();
    currentRotation++;
    if(currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation];
    draw();
  }

  // show the upcoming-next tetromino in the mini grid display
  const displaySquares = document.querySelectorAll('.mini-grid div');
  const displayWidth = 4;
  let displayIndex = 0;

  // Tetrominos without rotations
  const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2],
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
    [1, displayWidth, displayWidth + 1, displayWidth + 2],
    [0, 1, displayWidth, displayWidth + 1],
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
  ];

  // display the shape in the mini grid display
  function displayShape() {
    // remove any trace of the tetromino from the entire mini grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino');
    })

    upNextTetrominos[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino');
    })
  }

  // add functionality to start pause button
  startBtn.addEventListener('click', () => {
    if(timerId){
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random()*theTetrominoes.length);
      displayShape();
    }
  })

  // functionality for calculating score
  function addScore() {
    for(let i = 0; i < 199; i += width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

      // check if all the divs in the row have been filled
      if(row.every(index => squares[index].classList.contains('taken'))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        // remove that row from game to get the game keep moving
        row.forEach(index => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach(cell => grid.appendChild(cell));
      }
    }
  }

  // game over function

  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      scoreDisplay.innerHTML = 'END';
      clearInterval(timerId);
    }
  }
})