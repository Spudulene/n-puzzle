import { State } from './State.ts';

export class Game {
    public size: number;
    public start: State;
    public goal: State;
    public currentState: State;
    public tiles: number[];
    public completed = false;

<<<<<<< HEAD
    // creates a solvable game with the proper goal board and 
    // a randomized board that is solvable
    constructor(size : number){
        this.size = size;

        this.generateGoalBoard();
        this.generateStartBoard();

        // regenerate the goal board if it is not solvable
        while (!this.isSolvable()){
            this.generateStartBoard()
        }
    }

    // generates a random start board
    private generateStartBoard() {
        // initialize the array with 0's and create all numbers needed for the board
        let startState = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        let nums = Array.from({ length: this.size * this.size }, (_, i) => i);
    
        // Shuffle the numbers
        nums = nums.sort(() => Math.random() - 0.5);
    
        let row = -1;
        // insert the numbers into the startState array
        for (let n of nums.entries()) {
            row = n[0] % this.size === 0 ? row + 1 : row;
            startState[row][n[0] % this.size] = n[1];
        }
    
        // create the new state and set the currentState and currentTileSeq as the start state
        this.start = new State(startState,0, null, this.goal)
        this.currentState = this.start;
        this.currentTileSeq = this.start.tileSeq;
    }

    // generates the goal board based on the size of the board
    private generateGoalBoard() {
        // initialize the array with 0's
        let goalState = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    
        // insert 1 - n and then 0
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                goalState[i][j] = ((i * this.size) + j + 1) % (this.size * this.size);
            }
        }
        
        // create the state object and set it as the goal
        this.goal = new State(goalState, 0, null, null)
    }
    
    // checks if the shuffle is solvable if the board is of an even size
    private isSolvableEven(){
        let inversions = 0;
        let emptyValue = 0;
        let flattened : number[] = [];

        // Flatten the start state
        flattened = this.start.tileSeq.flat();

        // count all of the inversions
        for (let i = 0; i < this.size * this.size; i++) {
            for (let j = i + 1; j < this.size * this.size; j++) {
                if (flattened[j] !== emptyValue && flattened[i] !== emptyValue && flattened[i] > flattened[j]) {
                    inversions++;
                }
=======
    // creates a new game and initalizes all variables
    constructor(size: number) {
        this.size = size;
        this.goal = this.generateGoalBoard();
        this.start = this.generateStartBoard();
        this.currentState = this.start;
        this.tiles = this.start.tiles;
        
    }

    // generates a start board that is ensured to be solvable
    private generateStartBoard(): State {
        let nums: number[];
    
        do {
            // generate the numbers that will be used in the game
            nums = Array.from({ length: this.size * this.size }, (_, i) => i);
    
            // Fisher-Yates shuffle
            for (let i = nums.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [nums[i], nums[j]] = [nums[j], nums[i]];
>>>>>>> 910e47d101df247974aa970161c76c1305701332
            }
            // if the start board is not solvable or is the goal state, generate a new board
        } while (!this.isSolvable(nums) || nums.every((val, idx) => val === this.goal.tiles[idx]));
    
        return new State(nums, 0, null, this.goal, this.size);
    }
    
    // generates a goal State based on size
    private generateGoalBoard(): State {
        const goal = Array.from({ length: this.size * this.size }, (_, i) => (i + 1) % (this.size * this.size));
        return new State(goal, 0, null, null, this.size);
    }

<<<<<<< HEAD
    // checks if the shuffle is solvable if the board is of an odd size
    private isSolvableOdd(){
=======
    // checks if the tiles passed to it are solvable
    private isSolvable(tiles: number[]): boolean {
>>>>>>> 910e47d101df247974aa970161c76c1305701332
        let inversions = 0;
        // count the number of inversions
        for (let i = 0; i < tiles.length; i++) {
          for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inversions++;
          }
        }
<<<<<<< HEAD

        // Solvable if the number of inversions is even
        return inversions % 2 === 0;
    }
    
    // determine if the board is solvable based on its size
    private isSolvable() {
        return this.size % 2 == 1 ? this.isSolvableOdd() : this.isSolvableEven()
    }

    // create a new state with the parent as the current state
    public move(tileSeq : number[][]){
        this.currentState = new State(tileSeq, this.currentState.depth + 1, this.currentState, this.goal)
        this.currentTileSeq = this.currentState.tileSeq;
        if (this.currentState.equals(this.goal)){
            this.completed = true;
        }
    }

    // deep clone the current game
    public clone() {
        // create a new game of the same size and set all of the variables to the 
        // newly new objects
        const clonedGame = new Game(this.size);
        clonedGame.start = new State(this.start.tileSeq, 0, null, this.goal)
        clonedGame.goal = new State(this.goal.tileSeq, 0 , null, null)
        clonedGame.currentState = new State(this.start.tileSeq, 0, null, this.goal)
        clonedGame.currentTileSeq = JSON.parse(JSON.stringify(this.currentTileSeq));
        clonedGame.completed = this.completed;
        return clonedGame;
=======
    
        // if the size of the board is odd, inversions should be even
        if (this.size % 2 === 1) {
          return inversions % 2 === 0;

        // if the board size is even, solvability depents on the placement of the blank and the number of inversions
        } else {
          const rowFromBottom = this.size - Math.floor(tiles.indexOf(0) / this.size);
          // if blank is on even row and inversions are odd or if blank is on odd row and inversions are even
          // the sum of those will always be odd, so we check for that
          return (inversions + rowFromBottom) % 2 === 1;
        }
    }

    // do a move by the user
    public move(tiles: number[]) {
        // create a new state with the changed tile position
        this.currentState = new State(tiles, this.currentState.depth + 1, this.currentState, this.goal, this.size);
        this.tiles = tiles;
        // check if it is solved
        this.completed = this.currentState.equals(this.goal);
>>>>>>> 910e47d101df247974aa970161c76c1305701332
    }

    // deep clone for Game object
    public clone(): Game {
        const g = new Game(this.size);
        g.start = new State([...this.start.tiles], 0, null, this.goal, this.size);
        g.goal = new State([...this.goal.tiles], 0, null, null, this.size);
        g.currentState = new State([...this.tiles], 0, null, this.goal, this.size);
        g.tiles = [...this.tiles];
        g.completed = this.completed;
        return g;
    }

    // serilaztion for the solver
    static fromData(data: any) {
        const game = new Game(data.size);
        game.goal = State.fromData(data.goal);
        game.currentState = State.fromData(data.currentState);
        game.tiles = data.tiles;
        
        return game;
    } 
}
