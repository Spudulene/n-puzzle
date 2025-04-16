import React from "react";
import Tile from "./Tile";
import "../styles/Row.css";

const Row = ({row, rowIndex, onTileClick, backgroundImage}) => {
  return (
    <div className="row">
        {row.map((tile, colIndex) => (
            <Tile
                key={`${rowIndex}-${colIndex}`}
                value={tile}
                onClick={()=>onTileClick([rowIndex,colIndex])}
                backgroundImage={backgroundImage}
                boardSize={row.length}
            />
        ))}
    </div>
  );
};

export default Row;