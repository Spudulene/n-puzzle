export class State {
    public tiles: number[];
    public depth: number;
    public parent: State | null;
    public emptyIndex: number;
    private goal: State | null;
<<<<<<< HEAD
    private cost : number;
    private size : number;
    
    // creates a new State object
    public constructor(tileSeq : number[][], depth: number, parent: State | null, goal: State | null){
        this.tileSeq = tileSeq;
=======
    private cost: number = 0;
    public size: number;

    // creates a new State object and initalizes all variables
    constructor(tiles: number[], depth: number, parent: State | null, goal: State | null, size: number) {
        this.tiles = tiles;
>>>>>>> 910e47d101df247974aa970161c76c1305701332
        this.depth = depth;
        this.parent = parent;
        this.goal = goal;
        this.size = size;
        this.emptyIndex = this.tiles.indexOf(0);
    }

<<<<<<< HEAD
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
=======
    // check if one State has the same tiles as another
    public equals(other: State | null): boolean {
        if (!other) return false;
        return this.tiles.every((val, i) => val === other.tiles[i]);
    }

    // calculate the cost for a given heuristic
>>>>>>> 910e47d101df247974aa970161c76c1305701332
    public calculateCost(heuristic: string) {
        switch (heuristic) {
            case "WALKING DISTANCE":
                this.cost = this.calculateWalkingDistance();
                break;
            default:
                this.cost = this.depth;
        }
    }

<<<<<<< HEAD
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
=======
    // calculate the cost using walking distance
    private calculateWalkingDistance(): number {
        if (!this.goal) return 0;
        let total = 0;
        for (let i = 0; i < this.tiles.length; i++) {
            const val = this.tiles[i];
            // don't calculate the cost for the empty tile
            if (val === 0) continue;
            const currRow = Math.floor(i / this.size);
            const currCol = i % this.size;
            const goalIdx = this.goal.tiles.indexOf(val);
            const goalRow = Math.floor(goalIdx / this.size);
            const goalCol = goalIdx % this.size;
            total += Math.abs(currRow - goalRow) + Math.abs(currCol - goalCol);
>>>>>>> 910e47d101df247974aa970161c76c1305701332
        }
        return total;
    }

<<<<<<< HEAD
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
=======
    public getCost(): number {
        return this.cost;
>>>>>>> 910e47d101df247974aa970161c76c1305701332
    }

    public generateChildren(): State[] {
        const children: State[] = [];
        const row = Math.floor(this.emptyIndex / this.size);
        const col = this.emptyIndex % this.size;

<<<<<<< HEAD
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
=======
        const moves = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];
>>>>>>> 910e47d101df247974aa970161c76c1305701332

        for (const [dRow, dCol] of moves) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (newRow < 0 || newCol < 0 || newRow >= this.size || newCol >= this.size) continue;

            const newIndex = newRow * this.size + newCol;
            const newTiles = [...this.tiles];
            [newTiles[this.emptyIndex], newTiles[newIndex]] = [newTiles[newIndex], newTiles[this.emptyIndex]];
            const child = new State(newTiles, this.depth + 1, this, this.goal, this.size);
            if (!this.parent || !child.equals(this.parent)) {
                children.push(child);
            }
        }

        return children;
    }

<<<<<<< HEAD
    // manhattan distance + depth (standard A*)
    private calculateManhattanDistanceAndDepth(){
        if (this.goal === null) return 0;
        return this.calculateManhattanDistance() + this.depth;
    }

    // manhattan distance + linear conflict
    private calculateManhattanDistanceAndLinearConflict(){
        if (this.goal === null) return 0;
        return this.calculateManhattanDistance() + this.calculateLinearConflict();
=======
    public getHash(): string {
        return this.tiles.join(",");
    }

    static fromData(data: any) {
        const state = new State(data.tiles, data.depth, data.parent, data.goal, data.size);
        state.emptyIndex = data.emptyIndex;
        return state;
>>>>>>> 910e47d101df247974aa970161c76c1305701332
    }
}

<<<<<<< HEAD
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
=======
>>>>>>> 910e47d101df247974aa970161c76c1305701332
