// The Gameboard
const Game = (() => {
  let _board = new Array(3);
  for (let i=0; i< _board.length; i++){
    _board[i]= new Array(3);
  }

  //let _board = [[1,2,3],[4,5,6],[7,8,9]];

  const _wrapper = document.querySelector('#wrapper');

  const render = () => {
    while (_wrapper.lastChild) {
      _wrapper.removeChild(_wrapper.lastChild);
    }
    for(let i=0; i<3 ; i++){
      let _col = document.createElement('div');
      for(let j=0; j<3; j++){
        let zone = document.createElement('button');
        zone.textContent = _board[i][j];
        _col.appendChild(zone);
      }
      _wrapper.appendChild(_col);
    }
  }

  const getZone = (position) => {
    return(_board[Math.trunc(position/3)][position%3]);
  }

  const markZone = (position, shape) => {
    if(!getZone(position)){
      _board[Math.trunc(position/3)][position%3] = shape;
    }
  }

  return { render, getZone, markZone };
})();

// The players
const Player = (name, shape) => {
  const getName = () => name;
  const getShape = () => shape;
  return ({ getName, getShape });
};

const player1 = Player('Ju','X');
const player2 = Player('Manon','O');

// The game
const Partie = (() => {
  const _quelJoueur = 1;
})();



// FOR TESTING PURPOSE

