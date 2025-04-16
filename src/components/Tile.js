import React from "react";
import "../styles/Tile.css";

const Tile = ({ value, onClick, backgroundImage, boardSize }) => {
  const isEmpty = value === 0;

  let tileStyle = {};
  let overlayStyle = {};

  if (backgroundImage && !isEmpty) {
    const originalRow = Math.floor((value - 1) / boardSize);
    const originalCol = (value - 1) % boardSize;

    tileStyle = {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: `${boardSize * 100}% ${boardSize * 100}%`,
      backgroundPosition: `${(originalCol / (boardSize - 1)) * 100}% ${(originalRow / (boardSize - 1)) * 100}%`,
      backgroundRepeat: "no-repeat",
    };
  }

  // If it's empty, but you still want to show its slice
  if (backgroundImage && isEmpty) {
    const emptyRow = Math.floor((boardSize * boardSize - 1) / boardSize);
    const emptyCol = (boardSize * boardSize - 1) % boardSize;

    tileStyle = {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: `${boardSize * 100}% ${boardSize * 100}%`,
      backgroundPosition: `${(emptyCol / (boardSize - 1)) * 100}% ${(emptyRow / (boardSize - 1)) * 100}%`,
      backgroundRepeat: "no-repeat",
      position: "relative",
    };

    overlayStyle = {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)", // gray overlay
    };
  }

  return (
    <div className={`tile ${isEmpty ? "empty" : ""}`} onClick={onClick} style={tileStyle}>
      {backgroundImage && isEmpty && <div style={overlayStyle} />}
      {!backgroundImage && !isEmpty && value}
    </div>
  );
};

export default Tile;
