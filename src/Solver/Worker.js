import { Solver } from "./Solver.ts";
import { Game } from "../gameLogic/Game.ts";
/* eslint-disable no-restricted-globals */
self.onmessage = function (e) {
    // the data that App.js passed
    const { gameData, heuristic } = e.data;

    // create a new game object for solving 
    const game = Game.fromData(gameData);
    
    // create a new solver and solve the board
    const solver = new Solver(game, heuristic);
    const solutionPath = solver.solve();
  
    // only need to return the actual tiles from each state
    const path = solutionPath.map(state => state.tiles);
    
    postMessage({ path });
};