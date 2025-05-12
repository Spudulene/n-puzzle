import React from "react";
import "../styles/Tile.css";

const Tile = ({ value, onClick, backgroundImage, gridSize }) => {
  const isEmpty = value === 0;

  // splice the image and put each piece in its corresponding position
  const tileStyle = {
    // set the background image for a tile as the full image if it is not empty
    backgroundImage: backgroundImage && !isEmpty ? `url(${backgroundImage})` : undefined,
    // blow up the image so that we are able to display a small 
    // portion of the whole image on each tile
    backgroundSize: `${gridSize * 100}%`,
    // set the visible portion of the image based on what the tile value is (where the tile should be)
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
