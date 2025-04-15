import { State } from './State.ts';

export class Game{
    public size : number;
    public start : State;
    public goal : State;
    public currentState : State;
    public currentTileSeq : number[][];
    public completed = false;

    constructor(size : number){
        this.size = size;

        this.generateGoalBoard();
        this.generateStartBoard();
        while (!this.isSolvable()){
            this.generateStartBoard()
        }
    }

    private generateStartBoard() {
        let startState = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        let nums = Array.from({ length: this.size * this.size }, (_, i) => i);
    
        // Shuffle the numbers
        nums = nums.sort(() => Math.random() - 0.5);
    
        let row = -1;
        for (let n of nums.entries()) {
            row = n[0] % this.size === 0 ? row + 1 : row;
            startState[row][n[0] % this.size] = n[1];
        }
    
        this.start = new State(startState,0, null, this.goal)
        this.currentState = this.start;
        this.currentTileSeq = this.start.tileSeq;
    }

    private generateGoalBoard() {
        let goalState = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                goalState[i][j] = ((i * this.size) + j + 1) % (this.size * this.size);
            }
        }
        
        this.goal = new State(goalState, 0, null, null)
    }
    
    private isSolvableEven(){
        let inversions = 0;
        let emptyValue = 0;
        let flattened : number[] = [];

        // Flatten the start state
        flattened = this.start.tileSeq.flat();
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

    private isSolvableOdd(){
        // Solvable if the number of inversions is even
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
    
        return inversions % 2 === 0;
    }
    
    private isSolvable() {
        return this.size % 2 == 1 ? this.isSolvableOdd() : this.isSolvableEven()
    }

    public move(tileSeq : number[][]){
        this.currentState = new State(tileSeq, this.currentState.depth + 1, this.currentState, this.goal)
        this.currentTileSeq = this.currentState.tileSeq;
        if (this.currentState.equals(this.goal)){
            this.completed = true;
        }
    }

    public clone() {
        const clonedGame = new Game(this.size);
        clonedGame.start = JSON.parse(JSON.stringify(this.start));
        clonedGame.goal = JSON.parse(JSON.stringify(this.goal));
        clonedGame.currentState = JSON.parse(JSON.stringify(this.currentState));
        clonedGame.currentTileSeq = JSON.parse(JSON.stringify(this.currentTileSeq));
        clonedGame.completed = this.completed;
        return clonedGame;
      }

}