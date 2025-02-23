import React from "react";
import Tile from "./Tile";
import "../styles/Board.css";

const Board = ({ startState, onTileClick }) => {
  return (
    <div className="board">
      {startState.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            value={tile}
            onClick={() => onTileClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Board;
