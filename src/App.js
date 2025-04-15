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

  const [game, setGame] = useState(null)
  const [state, setState] = useState(null)
  const [tiles, setTiles] = useState(null)
  const [emptyPos, setEmptyPos] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [AISolutionPath, setAISolutionPath] = useState(null)
  const [AISolving, setAISolving] = useState(false);

  const hasRun = useRef()

  // initally create 3x3 board
  const constructor = () => {
    if (hasRun.current) return
    hasRun.current = true
    const game = new Game(size)
    setGame(game)
    setState(game.currentState)
    setTiles(game.currentTileSeq)
    setEmptyPos(game.currentState.emptyPos)
  }

  // whenever the user changes the size, create a new game
  useEffect(()=>{
    const newGame = new Game(size)
    setGame(newGame)
    setState(newGame.currentState)
    setTiles(newGame.currentTileSeq)
    setEmptyPos(newGame.currentState.emptyPos)
    setMoves(newGame.currentState.depth)
    setCompleted(newGame.completed)
  },[size])

  // if the use completes the puzzle, give them a new one
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

  useEffect(()=>{
    if(AISolutionPath){
      Promise.resolve(
        AISolutionPath.forEach((gameState, i) => {
          setTimeout(()=>{
            setTiles(gameState.tileSeq)
          }, i * 1000);
        })
      ).then(setAISolving(false))
    }
  },[AISolutionPath])

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

  const handleSolve = () => {
    setAISolving(true);
    let solutionPath = new PuzzleSolver(game, "MANHATTAN DISTANCE").solve();
    solutionPath.forEach((gameState, i) => {
      setTimeout(()=>{
        setTiles(gameState.tileSeq)
      }, i * 1000);
    })
  }

  //TODO create reset button, create shuffle button, create timer, give users the ability to upload images

  constructor();

  return (
    <div className="content">
      <span>Choose a board size: </span>
      <input type="number" min="3" max="6" value={size} onChange={(event) =>setSize(Number(event.target.value))}></input>
      <button disabled={size != 3 || AISolving} onClick={() => handleSolve()}>CLICK HERE TO START SOLVING</button>
      <Board state={tiles} onTileClick={handleMove}/>
      <div>Moves: {moves}</div>
    </div>
  );
}

export default App;
