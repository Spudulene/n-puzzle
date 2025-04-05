import React from "react";
import Tile from "./Tile";
import "../styles/Row.css";

const Row = ({row, rowIndex, onTileClick}) => {
  return (
    <div className="row">
        {row.map((tile, colIndex) => (
            <Tile
                key={`${rowIndex}-${colIndex}`}
                value={tile}
                position={[rowIndex,colIndex]}
                onClick={()=>onTileClick([rowIndex,colIndex])}
            />
        ))}
    </div>
  );
};

export default Row;