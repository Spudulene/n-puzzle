import React from "react";
import Tile from "./Tile";
import "../styles/Row.css";

const Row = ({row, rowIndex}) => {
  return (
    <div className="row">
        {row.map((tile, colIndex) => (
            <Tile
                key={`${rowIndex}-${colIndex}`}
                value={tile}
            //onClick={() => onTileClick(rowIndex, colIndex)}
            />
        ))}
    </div>
  );
};

export default Row;