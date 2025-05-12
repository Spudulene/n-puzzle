import { useRef } from "react";

import "../styles/Controls.css"
const Controls = ({ size, setSize, onShuffle, onReset, onSolve, onImageUpload, onImageRemove, disableAI, AISolving, highlight}) => {
    const fileInputRef = useRef();

    // gives the stylized file upload button
    // the same functionality as the default
    const handleFileClick = () => {
        fileInputRef.current.click();
    }

    return(
        <div className="controls">
        <span>
            Board Size: 
            <input disabled={AISolving} type="number" min="3" max="6" value={size} onChange={(e) =>setSize(e.target.value)}></input>
        </span>
        <button disabled={disableAI} onClick={onSolve} className={disableAI ? "disabled" : ""}>Solve using AI</button>
        <button disabled={AISolving} onClick={onShuffle} className={AISolving ? "disabled" : highlight ? "highlight" : ""}>Shuffle</button>
        <button disabled={AISolving} onClick={onReset} className={AISolving ? "disabled" : highlight ? "highlight" : ""}>Reset</button>
        {/* hide the default file uploader */}
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => onImageUpload(e)}
            style={{ display: "none" }}
        />
        {/* stylized button for uploading files */}
        <button onClick={handleFileClick}>Upload Image</button>
        <button onClick={onImageRemove}>Remove Image</button>
        </div>
    )
}

export default Controls