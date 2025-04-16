import React from "react";
import Row from "./Row";
import "../styles/Board.css";

const Board = ({ state, onTileClick, backgroundImage}) => {
  return (
    <div className="board">
        {state.map((row, rowIndex) =>
        <Row row={row} rowIndex={rowIndex} onTileClick={onTileClick} backgroundImage={backgroundImage}/>
        )}
    </div>
  );
};

export default Board;
