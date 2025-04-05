import {useState, useRef, useEffect} from "react"
import Board from "./components/Board";
import Controls from "./components/Controls";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/App.css";
const { PuzzleSolver } = require("./gameLogic/PuzzleSolver.ts")
const { Game } = require("./gameLogic/Game.ts")

function App() {
  const [size, setSize] = useState(3)
  const [moves, setMoves] = useState(0)
  const [test, setTest] = useState(null)
  const [state, setState] = useState(null)
  const [tiles, setTiles] = useState(null)
  const [game, setGame] = useState(null)
  const [emptyPos, setEmptyPos] = useState(null)
  const [completed, setCompleted] = useState(false)

  const errorRef = useRef()
  const hasRun = useRef()

  const constructor = () => {
    if (hasRun.current) return
    hasRun.current = true
    const game = new Game(size)
    setGame(game)
    setState(game.currentState)
    setTiles(game.currentTileSeq)
    setEmptyPos(game.currentState.emptyPos)
  }

  useEffect(()=>{
    if(completed) {
      setTimeout(() => {
        window.alert(`Congratulations, you solved the puzzle in ${moves} moves. Here's a new one.`)
        const newGame = new Game(size)
        setGame(newGame)
        setState(newGame.currentState)
        setTiles(newGame.currentTileSeq)
        setEmptyPos(newGame.currentState.emptyPos)
        setMoves(newGame.currentState.depth)
        setCompleted(newGame.completed)
      }, 500)
    }
  },[completed])

  //const solver = new PuzzleSolver(game, "WALKING DISTANCE")

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

  const validateMove = (clickedTilePos) =>{
    return (clickedTilePos[0] == emptyPos[0]-1 && clickedTilePos[1] == emptyPos[1]) ||
           (clickedTilePos[0] == emptyPos[0]+1 && clickedTilePos[1] == emptyPos[1]) ||
           (clickedTilePos[1] == emptyPos[1]-1 && clickedTilePos[0] == emptyPos[0]) || 
           (clickedTilePos[1] == emptyPos[1]+1 && clickedTilePos[0] == emptyPos[0])
  }

  const handleMove = (clickedTilePos) => {
    if (validateMove(clickedTilePos)){
      let tempTiles = [];
      tiles.forEach((row, rowIndex) => {
        tempTiles.push([])
        row.forEach(num =>{
          tempTiles[rowIndex].push(num)
        })
      });

      [tempTiles[emptyPos[0]][emptyPos[1]],tempTiles[clickedTilePos[0]][clickedTilePos[1]]] = [tempTiles[clickedTilePos[0]][clickedTilePos[1]],tempTiles[state.emptyPos[0]][state.emptyPos[1]]];
      game.move(tempTiles)
      setState(game.currentState)
      setTiles(game.currentTileSeq)
      setEmptyPos(game.currentState.emptyPos)
      setMoves(game.currentState.depth)
      setCompleted(game.completed)
    } 
  }

  function AdjustingInterval(workFunc, interval, errorFunc) {
    var that = this;
    var expected, timeout;
    this.interval = interval;

    this.start = function() {
        expected = Date.now() + this.interval;
        timeout = setTimeout(step, this.interval);
    }

    this.stop = function() {
        clearTimeout(timeout);
    }

    function step() {
      var drift = Date.now() - expected;
      if (drift > that.interval) {
          // You could have some default stuff here too...
          if (errorFunc) errorFunc();
      }
      workFunc();
      expected += that.interval;
      timeout = setTimeout(step, Math.max(0, that.interval-drift));
    }
}

tick(); // initial call to kick things off

  constructor();

  console.log(moves)

  return (
    <div className="content">
      {/* <span>Current Board size: {size} x {size}</span>
      <input onChange={(event) =>handleChangeN(event.target.value)}></input>
      <div ref={errorRef} style={{display:"none"}}>Board must be 3x3 or larger</div>
      <button onClick={() => solver.solve()}>CLICK HERE TO START SOLVING</button> */}
      <Board state={tiles} onTileClick={handleMove}/>
      <div>Moves: {moves}</div>
    </div>
  );
}

export default App;
