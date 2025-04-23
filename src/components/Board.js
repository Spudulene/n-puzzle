import React from "react";
import Tile from "./Tile";
import "../styles/Board.css";

const Board = ({ state, onTileClick, backgroundImage }) => {
  const size = state.length;

  return (
    <div
      className="board"
      // repeat the n columns and n rows
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {/* loop through all of the tiles in the baord and 
      create a tile based on that row and column */}
      {state.flat().map((value, index) => {
        const row = Math.floor(index / size);
        const col = index % size;
        return (
          <Tile
            key={`${row}-${col}`}
            value={value}
            position={[row, col]}
            onClick={() => onTileClick([row, col])}
            backgroundImage={backgroundImage}
            gridSize={size}
          />
        );
      })}
    </div>
  );
};

export default Board;

