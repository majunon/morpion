// Used to test if an array is "really" populated with a single value.
// This function does not skip "undefined" values
Array.prototype.trueEvery = function (pred) {
  for (var i = 0; i < this.length; i++) {
    if (!pred(this[i])) return false;
  }
  return true;
}

// The player factory function
// 3 properties : name, shape & type
// 3 functions to get them, 3 to set them
const Player = (name, shape, type) => {
  let _playerName = name;
  let _playerShape = shape;
  let _playerType = type;

  const getName = () => _playerName;
  const getShape = () => _playerShape;
  const getType = () => _playerType;

  const setName = (nouveauNom) => {
    _playerName = nouveauNom;
  }
  const setShape = (nouveauSign) => {
    _playerShape = nouveauSign;
  }
  const setType = (nouveauType) => {
    _playerType = nouveauType;
  }
  return ({ getName, getShape, setName, setShape, getType, setType });
};

//////////////////////
// THE GAME ..........
//////////////////////
const Partie = (() => {
  const _player1 = Player('', '', 'Human'); //Player1 always human
  const _player2 = Player('', '', ''); //Player2 can be CPU
  let _gameEnd = 0; //To stop the game after the end
  let _prochainJoueur; //To determine which player will make the next move

  const restart = document.querySelector('#restart'); //Restart button
  const divResult = document.querySelector('.result'); //The result display

  // Handle the form at the beggining of the game
  //---------------------------------------------
  // These 3 to handle the GUI
  const form = document.querySelector('.playerSelection');
  const board = document.querySelector('#wrapper');
  const validatePlayerSelection = document.querySelector('#validateSelection');

  function handleForm() {
    // This one to get player2 type
    const typePlayer2 = document.querySelector('#player2Human');
    // This one to get the sign of player1
    const signPlayer1 = document.querySelector('#player1X');
    // These 2 to get the player's names
    const player1name = document.querySelector('#player1Name');
    const player2name = document.querySelector('#player2Name');
    // Set the names of players
    _player1.setName(player1name.value || 'Player1');
    _player2.setName(player2name.value || 'Player2');
    // Set the signs of player. This will also determine who plays first.
    if (signPlayer1.checked) {
      _player1.setShape('X');
      _player2.setShape('O');
      _prochainJoueur = 'player1';
      // Display a message to tell which player needs to play.
      divResult.textContent = `Au tour de ${_player1.getName()}`;
    }
    else {
      _player1.setShape('O');
      _player2.setShape('X');
      _prochainJoueur = 'player2';
      // Display a message to tell which player needs to play.
      divResult.textContent = `Au tour de ${_player2.getName()}`;
    }
    // Set the type for player2
    if (typePlayer2.checked) {
      _player2.setType('Human');
    }
    else {
      _player2.setType('CPU');
    }
    if (_prochainJoueur == 'player2' && _player2.getType() == 'CPU') {
      handleTurn(0);
    }
    // Make the form disapear and display the board instead.
    form.style.display = "none";
    board.style.display = "block";
  }

  // When the validate button is clicked, handle the form data
  validatePlayerSelection.addEventListener('click', () => {
    handleForm();
  });

  // To know player's shapes
  const getShapePlayer1 = () => {
    return (_player1.getShape());
  }
  const getShapePlayer2 = () => {
    return (_player2.getShape());
  }

  // To know player's names
  const getNamePlayer1 = () => {
    return (_player1.getName());
  }
  const getNamePlayer2 = () => {
    return (_player2.getName());
  }

  // To know which turn it is
  const aQuiLeTour = () => {
    return (_prochainJoueur);
  }

  // To know if player2 is an AI or human
  const isCPU = () => {
    return (_player2.getType());
  }

  // Next turn routine :
  // Change the value of _prochainJoueur and display which turn it is.
  const _prochainTour = () => {
    if (_prochainJoueur == 'player1') {
      _prochainJoueur = 'player2';
      divResult.textContent = `Au tour de ${_player2.getName()}`;
    }
    else {
      _prochainJoueur = 'player1';
      divResult.textContent = `Au tour de ${_player1.getName()}`;
    }
  }

  // Handle the restart button
  restart.addEventListener('click', () => {
    Game.clear();
  })

  // Show or Hide the restart button
  const showRestart = () => {
    restart.style.display = "block";
  }
  const hideRestart = () => {
    restart.style.display = "none";
  }

  // Handle the winning board :
  // Display who win and the restart button + stop turn (_gameEnd = 1)
  const win = (player) => {
    let str = `${player} a gagné !`
    divResult.textContent = str;
    showRestart();
    _gameEnd = 1;
  }

  // Handle the tie board :
  // Display tie message and the restart button + stop turn (_gameEnd = 1)
  const tie = () => {
    divResult.textContent = `Match nul !`;
    showRestart();
    _gameEnd = 1;
  }

  // Handle the restart of the game by :
  // - allowing player to take turns (_gameEnd = 0)
  // - setting _prochainJoueur to the player with X sign
  // - display which turn it is
  const clearResult = () => {
    _gameEnd = 0;
    if (_player1.getShape() == "X") {
      _prochainJoueur = 'player1';
      divResult.textContent = `Au tour de ${_player1.getName()}`;
    }
    else {
      _prochainJoueur = 'player2';
      divResult.textContent = `Au tour de ${_player2.getName()}`;
    }
  }

  const handleTurn = (zone) => {
    let player = aQuiLeTour();
    let notFilled = 0;

    if (!_gameEnd) {
      if(player == 'player1'){
        notFilled = Game.markZone(zone, _player1.getShape());
        if (notFilled) {
          _prochainTour();
          Game.render();
          Game.endGame();
        }
        if(_player2.getType() == 'CPU' && !_gameEnd) {
          _smartCPUMove();
          _prochainTour();
          Game.render();
          Game.endGame();
        }
      }
      else{
        if(_player2.getType() == 'CPU') {
          _smartCPUMove();
          _prochainTour();
          Game.render();
          Game.endGame();
        }
        else{
          notFilled = Game.markZone(zone, _player2.getShape());
          if (notFilled) {
            _prochainTour();
            Game.render();
            Game.endGame();
          }
        }
      }
    }
  }

  const _randomCPUMove = () => {
    let coupsPossibles = [];
    for (let i = 0; i < 9; i++) {
      if (!Game.getZone(i)) { coupsPossibles.push(i) }
    }
    let rnd = Math.trunc(Math.random() * coupsPossibles.length);
    Game.markZone(coupsPossibles[rnd], _player2.getShape());
  }

  const _smartCPUMove = () => {
    let coupsPossibles = [];
    let foundAGoodMove = 0;
    for (let i = 0; i < 9; i++) {
      if (!Game.getZone(i)) { coupsPossibles.push(i) }
    }
    //Is there a winning move ?
    for (let j = 0; j < coupsPossibles.length; j++) {
      Game.markZone(coupsPossibles[j], _player2.getShape());
      if (Game.verifVictoire(_player2.getShape())) {
        foundAGoodMove = 1;
        break;
      }
      Game.unMarkZone(coupsPossibles[j]);
    }
    //Do we need to play for a draw ?
    if (!foundAGoodMove) {
      for (let k = 0; k < coupsPossibles.length; k++) {
        Game.markZone(coupsPossibles[k], _player1.getShape());
        if (Game.verifVictoire(_player1.getShape())) {
          foundAGoodMove = 1;
          Game.unMarkZone(coupsPossibles[k]);
          Game.markZone(coupsPossibles[k], _player2.getShape());
          break;
        }
        Game.unMarkZone(coupsPossibles[k]);
      }
    }
    if (!foundAGoodMove) {
      let rnd = Math.trunc(Math.random() * coupsPossibles.length);
      Game.markZone(coupsPossibles[rnd], _player2.getShape());
    }
  }

  return { handleTurn, aQuiLeTour, showRestart, hideRestart, clearResult, isCPU, getShapePlayer1, getShapePlayer2, getNamePlayer1, getNamePlayer2, win, tie }
})();

//////////////////////
// THE GAMEBOARD .....
//////////////////////
const Game = (() => {
  let _board = new Array(3);
  for (let i = 0; i < _board.length; i++) {
    _board[i] = new Array(3);
  }

  //let _board = [[1,2,3],[4,5,6],[7,8,9]];

  const _wrapper = document.querySelector('#wrapper');

  const render = () => {
    while (_wrapper.lastChild) {
      _wrapper.removeChild(_wrapper.lastChild);
    }
    for (let i = 0; i < 3; i++) {
      let _col = document.createElement('div');
      _col.classList.add("row");
      for (let j = 0; j < 3; j++) {
        let zone = document.createElement('button');
        zone.textContent = _board[i][j];
        zone.id = i * 3 + j;
        zone.classList.add("zone");
        zone.addEventListener('click', function (e) {
          Partie.handleTurn(this.id);
        })
        _col.appendChild(zone);
      }
      _wrapper.appendChild(_col);
    }
  }

  const clear = () => {
    _board = [[undefined, undefined, undefined], [undefined, undefined, undefined], [undefined, undefined, undefined]];
    Game.render();
    Partie.hideRestart();
    Partie.clearResult();
  }

  const getZone = (position) => {
    return (_board[Math.trunc(position / 3)][position % 3]);
  }

  const markZone = (position, shape) => {
    if (!getZone(position)) {
      _board[Math.trunc(position / 3)][position % 3] = shape;
      return (1);
    }
    else {
      return (0);
    }
  }

  const unMarkZone = (position) => {
    _board[Math.trunc(position / 3)][position % 3] = undefined;
  }

  const verifVictoire = (shape) => {
    for (let i = 0; i < 3; i++) {
      //Verif horizontals
      if (_board[i].trueEvery(sign => sign == shape)) {
        return (1);
      }
      //Verif verticals
      if (_board.map(zone => zone[i]).trueEvery(sign => sign == shape)) {
        return (1);
      }
    }
    //Verif diagonale 1
    if (_board[1][1] !== undefined) {
      let tmp = (_board[0][0] === _board[1][1]) + (_board[2][2] === _board[1][1]);
      if (_board[1][1] == shape && tmp == 2) { return (1); }
      tmp = (_board[0][2] === _board[1][1]) + (_board[2][0] === _board[1][1]);
      if (_board[1][1] == shape && tmp == 2) { return (1); }
    }
    else {
      return (0);
    }
  }

  const _verifTie = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (_board[i][j] === undefined) {
          return (0);
        }
      }
    }
    return (1);
  }

  const endGame = () => {
    let win = verifVictoire(Partie.getShapePlayer1());
    if (win) {
      Partie.win(Partie.getNamePlayer1());
    }
    else {
      win = verifVictoire(Partie.getShapePlayer2());
      if (win) {
        Partie.win(Partie.getNamePlayer2());
      }
      else {
        let tie = _verifTie();
        if (tie) {
          Partie.tie();
        }
      }
    }
  }

  return { render, getZone, markZone, clear, endGame, verifVictoire, unMarkZone };
})();

// FOR TESTING PURPOSE
Game.render();