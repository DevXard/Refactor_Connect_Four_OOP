
class game {

  constructor(p1, p2, HEIGHT = 6, WIDTH = 7){
  this.p1 = p1;
  this.p2 = p2
  this.WIDTH = WIDTH
  this.HEIGHT = HEIGHT
  this.currPlayer = p1
  this.board = []

  
  }
  
  makeBoard(){
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }
  makeHtmlBoard(){
  const board = document.getElementById('board');

  // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    this.handleClick = this.handleClick.bind(this)
    top.addEventListener('click', this.handleClick);

    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }
  
  findSpotForCol(x){
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

  handleClick(evt){
    const x = +evt.target.id;
    // console.log(this)
    const y = this.findSpotForCol(x);
    if(y === null){
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
    
    // switch players
    this.currPlayer = this.currPlayer === this.p1 ? this.p2 : this.p1;
  }
  checkForWin(){
    let _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer
  
      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.HEIGHT &&
          x >= 0 &&
          x < this.WIDTH &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
}

class Player{
  constructor(color){
    this.color = color
  }
}

const form = document.querySelector('#form')
const p1 = document.querySelector('#player1');
const p2 = document.querySelector('#player2');
const button = document.querySelector('#start');

form.addEventListener('submit', function(e){
  e.preventDefault()
  player1 = new Player(p1.value)
  player2 = new Player(p2.value)
  

  let game1 = new game(player1, player2);

  if(game1.board.length <= 0){
    game1.makeBoard();
    game1.makeHtmlBoard();
  }
  if(game1.board.length > 0){
    game1.board = [];
    document.querySelector('#board').innerHTML = '';
    game1.makeBoard();
    game1.makeHtmlBoard();
  }

})

