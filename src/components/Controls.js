import { useRef } from "react";

import "../styles/Controls.css"
const Controls = ({ size, setSize, onShuffle, onReset, onSolve, onImageUpload, onImageRemove, disableAI, AISolving, highlight}) => {
    const fileInputRef = useRef();

<<<<<<< HEAD
    // gives functionality to the stylized upload image button
=======
    // gives the stylized file upload button
    // the same functionality as the default
>>>>>>> 910e47d101df247974aa970161c76c1305701332
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
<<<<<<< HEAD
        <button onClick={onShuffle}>Shuffle</button>
        <button onClick={onReset}>Reset</button>

        {/* hidden file upload button */}
=======
        <button disabled={AISolving} onClick={onShuffle} className={AISolving ? "disabled" : highlight ? "highlight" : ""}>Shuffle</button>
        <button disabled={AISolving} onClick={onReset} className={AISolving ? "disabled" : highlight ? "highlight" : ""}>Reset</button>
        {/* hide the default file uploader */}
>>>>>>> 910e47d101df247974aa970161c76c1305701332
        <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => onImageUpload(e)}
            style={{ display: "none" }}
        />
<<<<<<< HEAD
        {/* stylized button that connects to the standard upload button */}
=======
        {/* stylized button for uploading files */}
>>>>>>> 910e47d101df247974aa970161c76c1305701332
        <button onClick={handleFileClick}>Upload Image</button>
        <button onClick={onImageRemove}>Remove Image</button>
        </div>
    )
}

export default Controls