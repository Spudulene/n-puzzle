import {useState, useRef, useEffect} from "react"
import Board from "./components/Board"
import Controls from "./components/Controls"
import Header from "./components/Header"
import Footer from "./components/Footer"
import "./styles/App.css"
const { Game } = require("./gameLogic/Game.ts")


function App() {
  const [size, setSize] = useState(3)
  const [moves, setMoves] = useState(0)
  
  const [game, setGame] = useState(null)
  const [copy, setCopy] = useState(null)
  const [state, setState] = useState(null)
  const [tiles, setTiles] = useState(null)
  const [completed, setCompleted] = useState(false)

  const [disableAI, setDisableAI] = useState(false)
  const [AISolving, setAISolving] = useState(false)
  const [AIMoves, setAIMoves] = useState(0)

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
    setTiles(game.tiles)
  }

  // whenever the user changes the size, create a new game
  useEffect(()=>{
    const newGame = new Game(size)
    setGame(newGame)
    setCopy(newGame.clone())
    setState(newGame.currentState)
    setTiles(newGame.tiles)
    setMoves(newGame.currentState.depth)
    setCompleted(newGame.completed)

    setTimeElapsed(0)
    clearInterval(intervalRef.current)
    setTimerActive(false)
  },[size])

  // if the use completes the puzzle, give them a new one
  useEffect(()=>{
    if(completed) {
      setTimeout(() => {
        window.alert(`Congratulations, you solved the puzzle in ${timeElapsed < 60 ? timeElapsed + "s": Math.floor(timeElapsed / 60) + "m " + timeElapsed % 60 + "s" } using ${moves} moves. Here's a new one.`)
        const newGame = new Game(size)
        setGame(newGame)
        setCopy(newGame.clone())
        setState(newGame.currentState)
        setTiles(newGame.tiles)
        setMoves(newGame.currentState.depth)
        setCompleted(newGame.completed)
      }, 500)

      setTimeElapsed(0)
      clearInterval(intervalRef.current)
      setTimerActive(false)
    }
  },[completed])

  const handleSetSize = (n) => {
    if (Number(n) <= 6 && n !== ""){
      setSize(Number(n))
    }
  }

  const handleMove = (clickedTilePos) => {
    if (!AISolving){
      const index = clickedTilePos
      const emptyIndex = state.emptyIndex;
    
      const validMoves = [
        emptyIndex - size,  // Up
        emptyIndex + size,  // Down
        emptyIndex - 1,     // Left
        emptyIndex + 1      // Right
      ];
    
      const isValid =
        validMoves.includes(index) &&
        Math.abs((emptyIndex % size) - (index % size)) <= 1; 
    
      if (!isValid) return;
    
      if (!timerActive) {
        setTimerActive(true);
        intervalRef.current = setInterval(() => {
          setTimeElapsed((prev) => prev + 1);
        }, 1000);
      }
    
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      game.move(newTiles); 
      setState(game.currentState);
      setTiles(game.tiles);
      setMoves(game.currentState.depth);
      setCompleted(game.completed);
    }
    
  };
  
  const handleSolve = () => {
    setAISolving(true)
    setDisableAI(true)
    setTimerActive(false)
    clearInterval(intervalRef.current)

    const worker = new Worker(new URL('./Solver/Worker.js', import.meta.url));
    worker.postMessage({
      gameData: {
        size: game.size,
        currentState: game.currentState,
        goal: game.goal,
        tiles: game.tiles
      },
      heuristic: "WALKING DISTANCE"
    });
  
    worker.onmessage = (e) => {
      const { path } = e.data;
      setAIMoves(path.length)
      path.forEach((tiles, i) => {
        setTimeout(() => {
          setTiles(tiles);
        }, i * 750); // adjust speed as needed
      });
      const duration = path.length * 750;
      setTimeout(() => {
        setAISolving(false);
      }, duration);
      worker.terminate();
    };
  };
  
  const handleShuffle = () => {
    const newGame = new Game(size)
    setGame(newGame)
    setCopy(newGame.clone())
    setState(newGame.currentState)
    setTiles(newGame.tiles)
    setMoves(newGame.currentState.depth)
    setCompleted(newGame.completed)

    setTimeElapsed(0)
    clearInterval(intervalRef.current)
    setTimerActive(false)

    setDisableAI(false)
    setAIMoves(0)
  }

  const handleReset = () => {
    const newGame = copy.clone()
    setGame(newGame)
    setState(newGame.currentState)
    setTiles(newGame.tiles)
    setMoves(newGame.currentState.depth)
    setCompleted(newGame.completed)

    setTimeElapsed(0)
    clearInterval(intervalRef.current)
    setTimerActive(false)

    setDisableAI(false)
    setAIMoves(0)
  }

  const handleImageUpload = (e) =>{
    if (e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0])
      setBackgroundImage(imageUrl)
    }
  }

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
        disableAI={size !== 3 || disableAI}
        AISolving={AISolving}
      />
      <Board
        state={tiles}
        onTileClick={handleMove}
        backgroundImage={backgroundImage}
      />
      <Footer moves={moves} AIMoves={AIMoves} time={timeElapsed}/>
    </div>
  )
}

export default App
