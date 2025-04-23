import {useState, useRef, useEffect} from "react"
import Board from "./components/Board"
import Controls from "./components/Controls"
import Header from "./components/Header"
import Footer from "./components/Footer"
import "./styles/App.css"
const { PuzzleSolver } = require("./gameLogic/PuzzleSolver.ts")
const { Game } = require("./gameLogic/Game.ts")

function App() {
  const [size, setSize] = useState(3)
  const [moves, setMoves] = useState(0)
  
  const [game, setGame] = useState(null)
  const [copy, setCopy] = useState(null)
  const [state, setState] = useState(null)
  const [tiles, setTiles] = useState(null)
  const [emptyPos, setEmptyPos] = useState(null)
  const [completed, setCompleted] = useState(false)

  const [AISolving, setAISolving] = useState(false)

  const [timeElapsed, setTimeElapsed] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const intervalRef = useRef(null)

  const [backgroundImage, setBackgroundImage] = useState(null)

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

  // whenever the user changes the size, create a new game and reset the timer
  useEffect(()=>{
    const newGame = new Game(size)
    setGame(newGame)
    setCopy(newGame.clone())
    setState(newGame.currentState)
    setTiles(newGame.currentTileSeq)
    setEmptyPos(newGame.currentState.emptyPos)
    setMoves(newGame.currentState.depth)
    setCompleted(newGame.completed)

    setTimeElapsed(0)
    clearInterval(intervalRef.current)
    setTimerActive(false)
  },[size])

  // if the user completes the puzzle, give them a new one
  useEffect(()=>{
    if(completed) {
      setTimeout(() => {
        window.alert(`Congratulations, you solved the puzzle in ${timeElapsed < 60 ? timeElapsed + "s": Math.floor(timeElapsed / 60) + "m " + timeElapsed % 60 + "s" } using ${moves} moves. Here's a new one.`)
        const newGame = new Game(size)
        setGame(newGame)
        setCopy(newGame.clone())
        setState(newGame.currentState)
        setTiles(newGame.currentTileSeq)
        setEmptyPos(newGame.currentState.emptyPos)
        setMoves(newGame.currentState.depth)
        setCompleted(newGame.completed)
      }, 500)

      setTimeElapsed(0)
      clearInterval(intervalRef.current)
      setTimerActive(false)
    }
  },[completed])

  // make sure the size is a number and set the size
  const handleSetSize = (n) => {
    if (Number(n) <= 6 && n !== ""){
      setSize(Number(n))
    }
  }

  // make sure that the clicked tile is is in the bounds of the puzzle and
  // that the clicked tile is orthogonal to the empty tile
  const validateMove = (clickedTilePos) =>{
    return (clickedTilePos[0] == emptyPos[0]-1 && clickedTilePos[1] == emptyPos[1]) ||
           (clickedTilePos[0] == emptyPos[0]+1 && clickedTilePos[1] == emptyPos[1]) ||
           (clickedTilePos[1] == emptyPos[1]-1 && clickedTilePos[0] == emptyPos[0]) || 
           (clickedTilePos[1] == emptyPos[1]+1 && clickedTilePos[0] == emptyPos[0])
  }

  // starts timer if necessary, validates the suggested move, and performs the move if valid
  const handleMove = (clickedTilePos) => {

    // if the timer is not active, this is the first move so we should start the timer
    if (!timerActive) {
      setTimerActive(true)
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }

    // check if the move is a valid move
    if (validateMove(clickedTilePos)){

      // make a copy of the current tiles and swap the empty position and clicked position
      const tempTiles = tiles.map(row => [...row]);
      [tempTiles[emptyPos[0]][emptyPos[1]],tempTiles[clickedTilePos[0]][clickedTilePos[1]]] = [tempTiles[clickedTilePos[0]][clickedTilePos[1]],tempTiles[state.emptyPos[0]][state.emptyPos[1]]]

      // do the move through the game object and update state variables
      game.move(tempTiles)
      setState(game.currentState)
      setTiles(game.currentTileSeq)
      setEmptyPos(game.currentState.emptyPos)
      setMoves(game.currentState.depth)
      setCompleted(game.completed)
    } 
  }

  // starts the AI solving and displays the found solution path
  const handleSolve = () => {
    setAISolving(true)
    let solutionPath = new PuzzleSolver(game, "WALKING DISTANCE").solve()
    solutionPath.forEach((gameState, i) => {
      setTimeout(()=>{
        setTiles(gameState.tileSeq)
      }, i * 1000)
    })
  }

  // shuffles the board, reset the timer, and unblock the AI solver
  const handleShuffle = () => {
    const newGame = new Game(size)
    setGame(newGame)
    setCopy(newGame.clone())
    setState(newGame.currentState)
    setTiles(newGame.currentTileSeq)
    setEmptyPos(newGame.currentState.emptyPos)
    setMoves(newGame.currentState.depth)
    setCompleted(newGame.completed)

    setTimeElapsed(0)
    clearInterval(intervalRef.current)
    setTimerActive(false)

    setAISolving(false)
  }

  // resets the board to the most recent shuffle, reset the timer, and unblock the AI solver
  const handleReset = () => {
    const newGame = copy.clone()
    setGame(newGame)
    setState(newGame.currentState)
    setTiles(newGame.currentTileSeq)
    setEmptyPos(newGame.currentState.emptyPos)
    setMoves(newGame.currentState.depth)
    setCompleted(newGame.completed)

    setTimeElapsed(0)
    clearInterval(intervalRef.current)
    setTimerActive(false)

    setAISolving(false)
  }

  // gets the file that was uploaded and sets it as the background image
  const handleImageUpload = (e) =>{
    // get the first file that was uploaded
    // and use it as the image
    if (e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0])
      setBackgroundImage(imageUrl)
    }
  }

  // reset the background image
  const handleImageRemove = () => {
    setBackgroundImage(null)
  }

  constructor()

  return (
    <div className="content">
      <Header />
      <Controls
        size={size}
        setSize={handleSetSize}
        onShuffle={handleShuffle}
        onReset={handleReset}
        onSolve={handleSolve}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        disableAI={size !== 3 || AISolving}
      />
      <Board
        state={tiles}
        onTileClick={handleMove}
        backgroundImage={backgroundImage}
      />
      <Footer moves={moves} time={timeElapsed}/>
    </div>
  )
}

export default App
