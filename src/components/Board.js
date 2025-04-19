import React from "react";
import Tile from "./Tile";
import "../styles/Board.css";

const Board = ({ state, onTileClick, backgroundImage }) => {
  const size = Math.sqrt(state.length); // Since it's a 1D array now

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
        gridTemplateRows: `repeat(${size}, 1fr)`,
      }}
    >
      {state.map((value, index) => {
        const row = Math.floor(index / size);
        const col = index % size;

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
