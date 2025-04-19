// solverWorker.ts
import { Solver } from "./Solver.ts";
import { Game } from "../gameLogic/Game.ts";
/* eslint-disable no-restricted-globals */
self.onmessage = function (e) {
    const { gameData, heuristic } = e.data;
    const game = Game.fromData(gameData); // you might need to write this method
    const solver = new Solver(game, heuristic);
    const solutionPath = solver.solve();
  
    // Serialize just the tile sequences
    const path = solutionPath.map(state => state.tiles);
  
    postMessage({ path });
};