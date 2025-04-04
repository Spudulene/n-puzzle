import React from "react";
import "../styles/Tile.css";

const Tile = ({ value, onClick }) => {
  return (
    <div className={`tile ${value === 0 ? "empty" : ""}`} onClick={onClick}>
      {value}
    </div>
  );
};

export default Tile;
