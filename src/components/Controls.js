import { useRef } from "react";

import "../styles/Controls.css"
const Controls = ({ size, setSize, onShuffle, onReset, onSolve, onImageUpload, onImageRemove, disableAI}) => {
    const fileInputRef = useRef();

    const handleFileClick = () => {
        fileInputRef.current.click();
    }

    return(
        <div className="controls">
        <span>
            Board Size: 
            <input type="number" min="3" max="6" value={size} onChange={(e) =>setSize(e.target.value)}></input>
        </span>
        <button disabled={disableAI} onClick={onSolve} className={disableAI ? "disabled" : ""}>Solve using AI</button>
        <button onClick={onShuffle}>Shuffle</button>
        <button onClick={onReset}>Reset</button>

        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => onImageUpload(e)}
            style={{ display: "none" }}
        />
        <button onClick={handleFileClick}>Upload Image</button>
        <button onClick={onImageRemove}>Remove Image</button>
        </div>
    )
}

export default Controls