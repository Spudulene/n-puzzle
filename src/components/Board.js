import React from "react";
import Tile from "./Tile";
import "../styles/Board.css";

const Board = ({ state, onTileClick, backgroundImage }) => {
  const size = Math.sqrt(state.length)

  return (
    <div
      className="board"
      style={{
        // render n columns and n rows
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {state.map((value, index) => {
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
