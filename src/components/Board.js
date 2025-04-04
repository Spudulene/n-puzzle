import React from "react";
import Row from "./Row";
import "../styles/Board.css";

const Board = ({ state, onTileClick}) => {
  return (
    <div className="board">
        {state.map((row, rowIndex) =>
        <Row row={row} rowIndex={rowIndex} onTileClick={onTileClick}/>
        )}
    </div>
  );
};

export default Board;
