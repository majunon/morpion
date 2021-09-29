// The players
const Player = (name, shape) => {
  const _playerName = name;
  const _playerShape = shape;

  const getName = () => _playerName;
  const getShape = () => _playerShape;
  const setName = (nouveauNom) => {
    _playerName = nouveauNom;  
  }
  const setShape = (nouveauSign) => {
    _playerShape = nouveauSign;
  }
  return ({ getName, getShape, setName, setShape  });
};

// The game
const Partie = (() => {
  const _player1 = Player('Julien', "X");
  const _player2 = Player('Manon', "O");
  let _prochainJoueur = 'player1';

  const aQuiLeTour = () => {
    return(_prochainJoueur);
  }

  const _prochainTour = () => {
    if(_prochainJoueur == 'player1'){
      _prochainJoueur = 'player2';
    }
    else{
      _prochainJoueur = 'player1';
    }
  }

  const _verifVictoire = () => {
    
  }

  const _verifTie = () => {
    
  }

  const _win = (player) => {
    
  }

  const _tie = () => {
    
  }

  const tourPlayer1 = (zone) => {
    let notFilled = Game.markZone(zone, _player1.getShape());
    if(notFilled){
      Game.render();
      _prochainTour();
      let win = _verifVictoire();
      if (win){
        _win(_player1);
      }
      else{
        let tie = _verifTie();
        if(tie){
          _tie();
        }
      }
    }
  }

  const tourPlayer2 = (zone) => {
    let notFilled = Game.markZone(zone, _player2.getShape());
    if(notFilled){
      Game.render();
      _prochainTour();
      let win = _verifVictoire();
      if (win){
        _win(_player2);
      }
      else{
        let tie = _verifTie();
        if(tie){
          _tie();
        }
      }
    }
  }
  return{tourPlayer1, tourPlayer2, aQuiLeTour}

})();

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
        zone.id = i*3+j;
        zone.classList.add("zone");
        zone.addEventListener('click',function(e){
          if(Partie.aQuiLeTour() === 'player1'){
            Partie.tourPlayer1(this.id);
          }
          else{
            Partie.tourPlayer2(this.id);
          }
        })
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
      return(1);
    }
    else{
      return(0);
    }
  }

  return { render, getZone, markZone };
})();

// FOR TESTING PURPOSE
Game.render();