import { Game } from "./Game.ts"
import { PriorityQueue } from "./PriorityQueue.js";
// PUT IN RETURN VALUES (PARAMS) : RETURN TYPE
export class State{
    public tileSeq : number[][];
    public depth : number;
    public parent : State | null;
    private goal: State | null;
    private cost : number;
    private size : number;

    public constructor(tileSeq : number[][], depth: number, parent: State | null, goal: State | null){
        this.tileSeq = tileSeq;
        this.depth = depth;
        this.parent = parent;
        this.goal = goal;
        this.size = tileSeq.length;
    }

    public equals (other: State | null){
        if (other === null) return;
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

    public printState() {

        const state = this.tileSeq.map((d) => d.join(" ")).join("\n")
        console.log(state)
    }

    // MISPLACED ALONE
    // MANHATTAN DISTANCE ALONE
    // INVERSION COUNT ALONE
    // WALKING DISTANCE ALONE
    // MANHATTAN DISTANCE + DEPTH (A*)
    // MANHATTAN DISTANCE + LINEAR CONFLICT

    public calculateCost(heuristic: string) {
        switch (heuristic) {
            case "MISPLACED":
                this.cost = this.calculateMisplaced();
                break;
            case "MANHATTAN":
                this.cost = this.calculateManhattanDistance();
                break;
            case "INVERSIONS":
                this.cost = this.calculateInversionCount();
                break;
            case "WALKING DISTANCE":
                this.cost = this.calculateWalkingDistance();
                break;
            case "MANHATTAN AND DEPTH":
                this.cost = this.calculateManhattanDistanceAndDepth();
                break;
            case "MANHATTAN AND LINEAR CONFLICT":
                this.cost = this.calculateManhattanDistanceAndLinearConflict();
                break;
        }
    }

    // WORKS!!
    private calculateMisplaced(){
        if (this.goal === null) return 0;
        let misplaced = 0;
        let size = this.tileSeq.length;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.tileSeq[i][j] !== this.goal.tileSeq[i][j]) {
                    misplaced++;
                }
            }
        }
        return misplaced;
    }

    // Implement
    private calculateManhattanDistance(){
        let size = this.tileSeq.length;
        let flattenedGoal : number[] = [];
        let flattenedState : number[] = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                flattenedGoal.push(((size * (i + 1)) + (j + 1) - size) % (size * size));
            }
        }
    
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < this.tileSeq[i].length; j++) {
                flattenedState.push(this.tileSeq[i][j]);
            }
        }
        
        return flattenedState.reduce((sum, val, idx) => {
            const b = flattenedState.indexOf(val);
            const g = flattenedGoal.indexOf(val);
            return sum + Math.abs(b % size - g % size) + Math.abs(Math.floor(b / size) - Math.floor(g / size));
        }, 0);
    }

    // Implement
    private calculateInversionCount(){
        if (this.goal === null) return 0;
        return 1;
    }

    // Implement
    private calculateWalkingDistance(){
        if (this.goal === null) return 0;
        return 1;
    }

    // Implement
    private calculateLinearConflict(){
        if (this.goal === null) return 0;
        return 1;
    }

    // Implement
    private calculateManhattanDistanceAndDepth(){
        if (this.goal === null) return 0;
        return this.calculateManhattanDistance() + this.depth;
    }

    private calculateManhattanDistanceAndLinearConflict(){
        if (this.goal === null) return 0;
        return this.calculateManhattanDistance() + this.calculateLinearConflict();
    }

    public generateChildren(){
        let row = -1;
        let col = -1;
        let tempTiles : number[][] = [];
        let childStates : State[] = [];
        for (let i = 0; i < this.size; i++){
            for (let j = 0; j < this.size; j++){
                if (this.tileSeq[i][j] == 0){
                    row = i;
                    col = j;
                    break;
                }
            }
        }
    
        // Top Child
        if(row-1>=0){
            tempTiles = this.copyTiles(this.tileSeq);
            [tempTiles[row-1][col], tempTiles[row][col]] = [tempTiles[row][col], tempTiles[row-1][col]];
    
            let topChild = new State(tempTiles, this.depth +1, this, this.goal);
            childStates.push(topChild);
        }
    
        // Bottom Child
        if(row+1<this.size){
            tempTiles = this.copyTiles(this.tileSeq);
            [tempTiles[row+1][col], tempTiles[row][col]] = [tempTiles[row][col], tempTiles[row+1][col]]
    
            let bottomChild = new State(tempTiles, this.depth +1, this, this.goal);
            childStates.push(bottomChild);
        }
    
        // Left Child
        if(col-1>=0){
            tempTiles = this.copyTiles(this.tileSeq);
            [tempTiles[row][col-1], tempTiles[row][col]] = [tempTiles[row][col], tempTiles[row][col-1]];
    
            let leftChild = new State(tempTiles, this.depth +1, this, this.goal);
            childStates.push(leftChild);
        }

        // Right Child
        if(col+1<this.size){
            tempTiles = this.copyTiles(this.tileSeq);
            [tempTiles[row][col+1], tempTiles[row][col]] = [tempTiles[row][col], tempTiles[row][col+1]];
    
            let rightChild = new State(tempTiles, this.depth +1, this, this.goal);
            childStates.push(rightChild);
        }
        if (this.parent !== undefined && this.parent !== null){
            childStates.filter((child) => !child.equals(this.parent));
        }

        return childStates
    }

    private copyTiles(tiles : number[][]){
        let copy : number[][] = [];

        for (let i = 0; i < this.size; i++){
            copy.push([])
            for (let j = 0; j < this.size; j++){
                copy[i].push(tiles[i][j]);
            }
        }

        return copy;
    }

    public checkInclusive(open : PriorityQueue, closed : State[]){
        //Should check if the current state is located within the open or closed lists and return a tuple with the flag code and the corresponding state index if necessary
        //Flag -1 --- State exists at a lower depth in closed or open
        //Flag 0  --- No issues
        //Flag 1  --- State exists at a higher depth in open, return equivalent state's depth
        //Flag 2  --- State exists at a higher depth in closed, return equivalent state's index
        for (let i = 0; i < open.size(); i++){
            if (this.equals(open.at(i))){
                if (this.depth > open.at(i).depth) return [-1,-1]
                else if (this.depth < open.at(i).depth) return [1,open.at(i).depth]
            }
        }

        closed.forEach((closedState) =>{
            if (this.equals(closedState)){
                if (this.depth > closedState.depth) return [-1,-1]
                else if (this.depth < closedState.depth) return [2,closed.indexOf(closedState)]
            }
        })
            
        return [0,-1]
    }




    /* public calculateCost(heuristic: string) {
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
    
    private misplacedHeuristic() {
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
    
    private manhattanHeuristic() {
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
    
    private linearConflict(state, goalState) {
        let conflictCount = 0;
        let manhattan = manhattanDistance(state, goalState); // Start with Manhattan Distance
        
        // Check rows for linear conflicts
        for (let row = 0; row < state.length; row++) {
          for (let col1 = 0; col1 < state[row].length; col1++) {
            for (let col2 = col1 + 1; col2 < state[row].length; col2++) {
              const tile1 = state[row][col1];
              const tile2 = state[row][col2];
              if (tile1 !== 0 && tile2 !== 0 && this.isInCorrectRowAndConflict(tile1, tile2, goalState)) {
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
              if (tile1 !== 0 && tile2 !== 0 && this.isInCorrectColumnAndConflict(tile1, tile2, goalState)) {
                conflictCount++;
              }
            }
          }
        }
        
        return manhattan + 2 * conflictCount; // Add double the number of conflicts to the Manhattan distance
    }
      
    private isInCorrectRowAndConflict(tile1, tile2, goalState) {
        const goalPos1 = findTilePosition(tile1, goalState);
        const goalPos2 = findTilePosition(tile2, goalState);
        return goalPos1.row === goalPos2.row && goalPos1.col > goalPos2.col;
    }
      
    private isInCorrectColumnAndConflict(tile1, tile2, goalState) {
        const goalPos1 = findTilePosition(tile1, goalState);
        const goalPos2 = findTilePosition(tile2, goalState);
        return goalPos1.col === goalPos2.col && goalPos1.row > goalPos2.row;
    }
      
    private walkingDistanceHeuristic(state) {
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
    
}