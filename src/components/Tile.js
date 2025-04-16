import React from "react";
import "../styles/Tile.css";

const Tile = ({ value, onClick, backgroundImage, gridSize }) => {
  const isEmpty = value === 0;

  const tileStyle = {
    backgroundImage: backgroundImage && !isEmpty ? `url(${backgroundImage})` : undefined,
    backgroundSize: `${gridSize * 100}%`,
    backgroundPosition: backgroundImage && !isEmpty 
      ? `${(value - 1) % gridSize * (100 / (gridSize - 1))}% ${Math.floor((value - 1) / gridSize) * (100 / (gridSize - 1))}%`
      : undefined,
    filter: isEmpty ? 'grayscale(80%) brightness(85%)' : 'none',
  };

  return (
    <div className={`tile ${isEmpty ? "empty" : ""}`} onClick={onClick} style={tileStyle}>
      {!backgroundImage && value !== 0 && value}
    </div>
  );
};


export default Tile;
