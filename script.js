// The Gameboard
const Game = (() => {
  let board = new Array(9);
  return ({ board });
})();

// The players
const Player = (name, shape) => {
  const getName = () => name;
  const getShape = () => shape;
  return ({ getName, getShape });
};

const player1 = Player('Ju','X');
const player2 = Player('Manon','O');