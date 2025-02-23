import { useRef, useState } from "react"

export const State = ({ tileSeq, depth, parent}) => {
    console.log("Creating state??")
    console.log(tileSeq)

    const equals = (other) =>{
        let op = other.tileSeq;
        for (let i = 0; i < op.length; i++) {
            for (let j = 0; j < op[0].length; j++) {
                if (this.tileSeq[i][j] !== op[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    return (tileSeq, depth, parent)
}


/* 
export class State {
    constructor(tileSeq, depth, parent) {
        this.tileSeq = tileSeq;
        this.depth = depth;
        this.parent = parent;
    }

    // Used to check state equivalency
    equals(other) {
        let op = other.tileSeq;
        for (let i = 0; i < op.length; i++) {
            for (let j = 0; j < op[0].length; j++) {
                if (this.tileSeq[i][j] !== op[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
} */



export default State;


/* calculateCost(heuristic) {
    switch (heuristic) {
        case "MISPLACED":
            this.misplacedHeuristic();
            this.cost = this.misplaced;
            break;
        case "MANHATTAN":
            this.manhattanHeuristic();
            this.cost = this.manhattanDistance;
            break;
        case "INVERSIONS":
            this.inversionHeuristic();
            this.cost = this.inversions;
            break;
        case "WALKING DISTANCE":
            this.walkingDistanceHeuristic();
            this.cost = this.walkingDistance;
            break;
        case "MISPLACED AND DEPTH":
            this.misplacedHeuristic();
            this.cost = this.misplaced + this.depth;
            break;
        case "MANHATTAN AND DEPTH":
            this.manhattanHeuristic();
            this.cost = this.manhattanDistance + this.depth;
            break;
        case "WALKING DISTANCE AND DEPTH":
            this.walkingDistanceHeuristic();
            this.cost = this.walkingDistance + this.depth;
            break;
        case "WALKING DISTANCE AND MANHATTAN":
            this.walkingDistanceHeuristic();
            this.manhattanHeuristic();
            this.cost = this.walkingDistance + this.manhattanDistance;
            break;
        case "MANHATTAN AND LINEAR CONFLICT":
            this.linearConflictHeuristic();
            this.manhattanHeuristic();
            this.cost = this.manhattanDistance + this.linearConflict;
            break;
        case "ALL":
            this.misplacedHeuristic();
            this.manhattanHeuristic();
            this.linearConflictHeuristic();
            this.inversionHeuristic();
            this.walkingDistanceHeuristic();
            this.cost = this.misplaced + this.manhattanDistance + this.linearConflict + this.inversions + this.manhattanDistance + this.depth;
            break;
    }
}

misplacedHeuristic() {
    let misplaced = 0;
    let size = this.tileSeq.length;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (this.tileSeq[i][j] !== ((size * i) + (j + 1)) % (size * size)) {
                misplaced++;
            }
        }
    }
    this.misplaced = misplaced;
}

manhattanHeuristic() {
    let size = this.tileSeq.length;
    let goal = [];
    let a = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            goal.push(((size * (i + 1)) + (j + 1) - size) % (size * size));
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < this.tileSeq[i].length; j++) {
            a.push(this.tileSeq[i][j]);
        }
    }

    this.manhattanDistance = a.reduce((sum, val, idx) => {
        const b = a.indexOf(val);
        const g = goal.indexOf(val);
        return sum + Math.abs(b % size - g % size) + Math.abs(Math.floor(b / size) - Math.floor(g / size));
    }, 0);
}

linearConflict(state, goalState) {
    let conflictCount = 0;
    let manhattan = manhattanDistance(state, goalState); // Start with Manhattan Distance
    
    // Check rows for linear conflicts
    for (let row = 0; row < state.length; row++) {
      for (let col1 = 0; col1 < state[row].length; col1++) {
        for (let col2 = col1 + 1; col2 < state[row].length; col2++) {
          const tile1 = state[row][col1];
          const tile2 = state[row][col2];
          if (tile1 !== 0 && tile2 !== 0 && isInCorrectRowAndConflict(tile1, tile2, goalState)) {
            conflictCount++;
          }
        }
      }
    }
  
    // Check columns for linear conflicts
    for (let col = 0; col < state[0].length; col++) {
      for (let row1 = 0; row1 < state.length; row1++) {
        for (let row2 = row1 + 1; row2 < state.length; row2++) {
          const tile1 = state[row1][col];
          const tile2 = state[row2][col];
          if (tile1 !== 0 && tile2 !== 0 && isInCorrectColumnAndConflict(tile1, tile2, goalState)) {
            conflictCount++;
          }
        }
      }
    }
    
    return manhattan + 2 * conflictCount; // Add double the number of conflicts to the Manhattan distance
}
  
isInCorrectRowAndConflict(tile1, tile2, goalState) {
    const goalPos1 = findTilePosition(tile1, goalState);
    const goalPos2 = findTilePosition(tile2, goalState);
    return goalPos1.row === goalPos2.row && goalPos1.col > goalPos2.col;
}
  
isInCorrectColumnAndConflict(tile1, tile2, goalState) {
    const goalPos1 = findTilePosition(tile1, goalState);
    const goalPos2 = findTilePosition(tile2, goalState);
    return goalPos1.col === goalPos2.col && goalPos1.row > goalPos2.row;
}
  
walkingDistanceHeuristic(state) {
    const size = state.length;
    let walkingDistance = 0;
  
    // Create a grid to store the walking distances
    const distanceGrid = Array.from({ length: size }, () => Array(size).fill(0));
  
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const value = state[row][col];
        
        // We only calculate the walking distance for non-empty tiles
        if (value !== 0) {
          const targetRow = Math.floor((value - 1) / size);
          const targetCol = (value - 1) % size;
          
          // Calculate the Manhattan-like walking distance for the tile
          distanceGrid[row][col] = Math.abs(row - targetRow) + Math.abs(col - targetCol);
        }
      }
    }
  
    // Sum up the walking distances for all tiles
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        walkingDistance += distanceGrid[row][col];
      }
    }
  
    return walkingDistance;
} */