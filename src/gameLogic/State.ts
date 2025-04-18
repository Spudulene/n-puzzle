import { PriorityQueue } from "./PriorityQueue.js";

export class State{
    public tileSeq : number[][];
    public depth : number;
    public parent : State | null;
    public emptyPos : number[];
    private goal: State | null;
    private cost : number;
    private size : number;
    

    public constructor(tileSeq : number[][], depth: number, parent: State | null, goal: State | null){
        this.tileSeq = tileSeq;
        this.depth = depth;
        this.parent = parent;
        this.goal = goal;
        this.size = tileSeq.length;
        this.findEmptyTile()
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

    private calculateManhattanDistance(){
        let size = this.tileSeq.length;
        let flattenedGoal : number[] = [];
        let flattenedState : number[] = [];
        if (this.goal) flattenedGoal = this.goal?.tileSeq.flat()

        flattenedState = this.tileSeq.flat()
        
        return flattenedState.reduce((sum, val, idx) => {
            const b = flattenedState.indexOf(val);
            const g = flattenedGoal.indexOf(val);
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

    private calculateWalkingDistance(){
        if (this.goal === null) return 0;
        const size = this.size;
        let walkingDistance = 0;
      
        // Create a grid to store the walking distances
        const distanceGrid = Array.from({ length: size }, () => Array(size).fill(0));
      
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            const value = this.tileSeq[row][col];
            
            // Calculate walking distance for non-empty tiles
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
            childStates = childStates.filter((child) => !child.equals(this.parent))
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

    public findEmptyTile(){
        let flattened : number[] = [];

        // Flatten the start state
        flattened = this.tileSeq.flat();

        this.emptyPos = [Math.floor(flattened.indexOf(0) / this.size) ,flattened.indexOf(0) % this.size]
    }
}