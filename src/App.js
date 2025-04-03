import {useState, useRef, useEffect} from "react"
import Board from "./components/Board";
import Controls from "./components/Controls";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/App.css";
/* import { PriorityQueue } from "./gameLogic/PriorityQueue";
const { State } = require("./gameLogic/State.ts") */
const { PuzzleSolver } = require("./gameLogic/PuzzleSolver.ts")
const { Game } = require("./gameLogic/Game.ts")

function App() {
  console.clear()
  const[size,setSize] = useState(3);
  const errorRef = useRef(null);
  const [moves, setMoves] = useState(0);

  const game = new Game(size)
  game.startGame();
  const solver = new PuzzleSolver(game, "WALKING DISTANCE")
  //solver.solve();

  const handleChangeN = (newVal) =>{
    const num = Number(newVal)
    if (newVal.trim() === ""){
      setSize(3)
      errorRef.current.style = "display: none"
    }
    else if (num < 3 || !Number.isInteger(num)){
      errorRef.current.style = ""
    }
    else{
      setSize(num)
      errorRef.current.style = "display: none"
    }
  }

  return (
    <>
      <span>Current Board size: {size} x {size}</span>
      <input onChange={(event) =>handleChangeN(event.target.value)}></input>
      <div ref={errorRef} style={{display:"none"}}>Board must be 3x3 or larger</div>
      <button onClick={() => solver.solve()}>CLICK HERE TO START SOLVING</button>
    </>
  );
}

export default App;
