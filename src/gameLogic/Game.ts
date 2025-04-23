import { State } from './State.ts';

export class Game{
    public size : number;
    public start : State;
    public goal : State;
    public currentState : State;
    public currentTileSeq : number[][];
    public completed = false;

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
            }
        }

        // if blank is on even row and inversions are odd or if blank is on odd row and inversions are even
        return (this.start.emptyPos[0] % 2 == 0 && inversions % 2 == 1) || (this.start.emptyPos[0] % 2 == 1 && inversions % 2 == 0) 
    }

    // checks if the shuffle is solvable if the board is of an odd size
    private isSolvableOdd(){
        let inversions = 0;
        let emptyValue = 0;
        let flattened : number[] = [];

        // Flatten the start state
        flattened = this.start.tileSeq.flat();

        // Count inversions
        for (let i = 0; i < this.size * this.size; i++) {
            for (let j = i + 1; j < this.size * this.size; j++) {
                if (flattened[j] !== emptyValue && flattened[i] !== emptyValue && flattened[i] > flattened[j]) {
                    inversions++;
                }
            }
        }

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
    }
}