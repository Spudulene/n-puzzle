import React from "react";
import Tile from "./Tile";
import "../styles/Board.css";

const Board = ({ state, onTileClick, backgroundImage }) => {
  const size = Math.sqrt(state.length)

  return (
    <div
      className="board"
      // repeat the n columns and n rows
      style={{
        // render n columns and n rows
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
<<<<<<< HEAD
      {/* loop through all of the tiles in the baord and 
      create a tile based on that row and column */}
      {state.flat().map((value, index) => {
=======
      {state.map((value, index) => {
>>>>>>> 910e47d101df247974aa970161c76c1305701332
        const row = Math.floor(index / size);
        const col = index % size;
        // render each tile passing in the value from the board
        return (
          <Tile
            key={`${row}-${col}`}
            value={value}
            position={[row, col]}
            onClick={() => onTileClick(index)}
            backgroundImage={backgroundImage}
            gridSize={size}
          />
        );
      })}
    </div>
  );
};

export default Board;
