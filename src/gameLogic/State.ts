import { PriorityQueue } from "./PriorityQueue.js";

export class State{
    public tileSeq : number[][];
    public depth : number;
    public parent : State | null;
    public emptyPos : number[];
    private goal: State | null;
    private cost : number;
    private size : number;
    
    // creates a new State object
    public constructor(tileSeq : number[][], depth: number, parent: State | null, goal: State | null){
        this.tileSeq = tileSeq;
        this.depth = depth;
        this.parent = parent;
        this.goal = goal;
        this.size = tileSeq.length;
        this.findEmptyTile()
    }

    // check if one state equals another
    public equals (other: State | null){
        if (other === null) return;
        let op = other.tileSeq;
        // loop through each number, and return false if any are not equal
        for (let i = 0; i < op.length; i++) {
            for (let j = 0; j < op[0].length; j++) {
                if (this.tileSeq[i][j] !== op[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    // calculate the 'cost' of the current state based on the heuristic passed
    public calculateCost(heuristic: string) {
        switch (heuristic) {
            // time: .5 sec. moves: 88
            case "MISPLACED":
                this.cost = this.calculateMisplaced();
                break;
            // time: .1 sec. moves: 51
            case "MANHATTAN":
                this.cost = this.calculateManhattanDistance();
                break;
            // time: .3 sec. moves: 75
            case "INVERSIONS":
                this.cost = this.calculateInversionCount();
                break;
            // time: .06 sec. moves: 32
            case "WALKING DISTANCE":
                this.cost = this.calculateWalkingDistance();
                break;
            // time: 10 sec. moves: 22
            case "MANHATTAN AND DEPTH":
                this.cost = this.calculateManhattanDistanceAndDepth();
                break;
            // time: .5 sec. moves: 39
            case "MANHATTAN AND LINEAR CONFLICT":
                this.cost = this.calculateManhattanDistanceAndLinearConflict();
                break;
        }
    }

    // calculate the cost based on the misplaced tiles
    private calculateMisplaced(){
        if (this.goal === null) return 0;
        let misplaced = 0;
        let size = this.tileSeq.length;

        // loop through each number in the current state and increment if it 
        // is not the same as the goal number at that index
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (this.tileSeq[i][j] !== this.goal.tileSeq[i][j]) {
                    misplaced++;
                }
            }
        }
        return misplaced;
    }

    // calculated the cost based on the manhattan (straight-line) distance
    private calculateManhattanDistance(){
        let size = this.tileSeq.length;
        let flattenedGoal : number[] = [];
        let flattenedState : number[] = [];

        // get the flattened goal state and the flattened current state
        if (this.goal) flattenedGoal = this.goal?.tileSeq.flat()
        flattenedState = this.tileSeq.flat()
        
        // go through each number in the flattened state and return one number
        return flattenedState.reduce((sum, val) => {
            // find the position of the current number
            const b = flattenedState.indexOf(val);
            // find the position of where it should be
            const g = flattenedGoal.indexOf(val);
            // calculate the distance but not allowing diagonal movements
            return sum + Math.abs(b % size - g % size) + Math.abs(Math.floor(b / size) - Math.floor(g / size));
        }, 0);
    }

    private calculateInversionCount(){
        let inversions = 0;
        let flattenedState : number[] = [];
        // Flatten the start state
        flattenedState = this.tileSeq.flat()
    
        // Count inversions
        for (let i = 0; i < this.size * this.size; i++) {
            for (let j = i + 1; j < this.size * this.size; j++) {
                if (flattenedState[j] !== 0 && flattenedState[i] !== 0 && flattenedState[i] > flattenedState[j]) {
                    inversions++;
                }
            }
        }
        return inversions;
    }

    // calculate the cost based on the walking distance
    private calculateWalkingDistance(){
        const size = this.size;
        let walkingDistance = 0;
      
        // create a grid to store the walking distances
        const distanceGrid = Array.from({ length: size }, () => Array(size).fill(0));
      
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            const value = this.tileSeq[row][col];
            
            // calculate walking distance for non-empty tiles
            if (value !== 0) {
              const targetRow = Math.floor((value - 1) / size);
              const targetCol = (value - 1) % size;
              
              // calculate the Manhattan-like walking distance for the tile
              distanceGrid[row][col] = Math.abs(row - targetRow) + Math.abs(col - targetCol);
            }
          }
        }
      
        // sum up the walking distances for all tiles
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            walkingDistance += distanceGrid[row][col];
          }
        }
      
        return walkingDistance;
    }

    private calculateLinearConflict() {
        let conflict = 0;

        // Row conflicts
        for (let row = 0; row < this.size; row++) {
            let maxVal = -1;
            for (let col = 0; col < this.size; col++) {
                const value = this.tileSeq[row][col];
                if (value !== 0 && Math.floor((value - 1) / this.size) === row) {
                    if (value > maxVal) {
                        maxVal = value;
                    } else {
                        conflict += 2;
                    }
                }
            }
        }

        // Column conflicts
        for (let col = 0; col < this.size; col++) {
            let maxVal = -1;
            for (let row = 0; row < this.size; row++) {
                const value = this.tileSeq[row][col];
                if (value !== 0 && (value - 1) % this.size === col) {
                    if (value > maxVal) {
                        maxVal = value;
                    } else {
                        conflict += 2;
                    }
                }
            }
        }

        return conflict;
    }

    // manhattan distance + depth (standard A*)
    private calculateManhattanDistanceAndDepth(){
        if (this.goal === null) return 0;
        return this.calculateManhattanDistance() + this.depth;
    }

    // manhattan distance + linear conflict
    private calculateManhattanDistanceAndLinearConflict(){
        if (this.goal === null) return 0;
        return this.calculateManhattanDistance() + this.calculateLinearConflict();
    }

    // generates all possible children/neighbor states for the current state
    public generateChildren(){
        let row = this.emptyPos[0];
        let col = this.emptyPos[1];
        let tempTiles : number[][] = [];
        let childStates : State[] = [];

        // all of these make sure that the empty tile can be moved to the certain position.
        // It then creates a copy of the current tiles, swaps the empty tile and the tile to 
        // whatever direction it check, creates a new State object and then pushes it to the array 
    
        // top child
        if(row-1>=0){
            tempTiles = this.copyTiles(this.tileSeq);
            [tempTiles[row-1][col], tempTiles[row][col]] = [tempTiles[row][col], tempTiles[row-1][col]];
    
            let topChild = new State(tempTiles, this.depth +1, this, this.goal);
            childStates.push(topChild);
        }
    
        // bottom child
        if(row+1<this.size){
            tempTiles = this.copyTiles(this.tileSeq);
            [tempTiles[row+1][col], tempTiles[row][col]] = [tempTiles[row][col], tempTiles[row+1][col]]
    
            let bottomChild = new State(tempTiles, this.depth +1, this, this.goal);
            childStates.push(bottomChild);
        }
    
        // left child
        if(col-1>=0){
            tempTiles = this.copyTiles(this.tileSeq);
            [tempTiles[row][col-1], tempTiles[row][col]] = [tempTiles[row][col], tempTiles[row][col-1]];
    
            let leftChild = new State(tempTiles, this.depth +1, this, this.goal);
            childStates.push(leftChild);
        }

        // right child
        if(col+1<this.size){
            tempTiles = this.copyTiles(this.tileSeq);
            [tempTiles[row][col+1], tempTiles[row][col]] = [tempTiles[row][col], tempTiles[row][col+1]];
    
            let rightChild = new State(tempTiles, this.depth +1, this, this.goal);
            childStates.push(rightChild);
        }

        if (this.parent !== undefined && this.parent !== null){
            // make sure that we aren't adding the parent state back into the child array
            childStates = childStates.filter((child) => !child.equals(this.parent))
        }

        return childStates
    }

    // deep copy for the tiles
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

    // checks if the current state is already in the queue or is in the closed state
    // and return a flag based on the depth of current state compared to the state found
    public checkInclusive(open : PriorityQueue, closed : State[]){

        // check all of the items in the queue
        for (let i = 0; i < open.size(); i++){
            if (this.equals(open.at(i))){
                if (this.depth > open.at(i).depth) return [-1,-1] // found lower in solution tree (bad)
                else if (this.depth < open.at(i).depth) return [1,open.at(i).depth] // found higher in solution tree (good)
            }
        }

        // check all of the items in the closed array
        closed.forEach((closedState) =>{
            if (this.equals(closedState)){
                if (this.depth > closedState.depth) return [-1,-1] // found lower in solution tree (bad)
                else if (this.depth < closedState.depth) return [2,closed.indexOf(closedState)] // found higher in solution tree (good)
            }
        })
            
        return [0,-1]
    }

    // finds the position of the empty tile
    public findEmptyTile(){
        let flattened : number[] = [];

        // Flatten the start state
        flattened = this.tileSeq.flat();

        this.emptyPos = [Math.floor(flattened.indexOf(0) / this.size) ,flattened.indexOf(0) % this.size]
    }
}