import { State } from './State.ts';

export class Game{
    public size : number;
    public start : State;
    public goal : State;
    public currentState : State;
    public currentTileSeq : number[][];

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
    
    // IF WE EXPAND FROM 3X3 TO NXN
    private isSolvableEven(){

    }

    private isSolvableOdd(){
        // Solvable if the number of inversions is even
        let inversions = 0;
        let emptyValue = 0;
        let temp : number[] = [];

        // Flatten the start state
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                temp.push(this.start.tileSeq[i][j]);
            }
        }
    
        // Count inversions
        for (let i = 0; i < this.size * this.size; i++) {
            for (let j = i + 1; j < this.size * this.size; j++) {
                if (temp[j] !== emptyValue && temp[i] !== emptyValue && temp[i] > temp[j]) {
                    inversions++;
                }
            }
        }
    
        return inversions % 2 === 0;
    }
    
    private isSolvable() {
        return this.size % 2 == 1 ? this.isSolvableOdd() : this.isSolvableEven()
    }

    public printPath(board: State | null, recursions: number){
        if (board === null) return;
        let k : number | undefined;
        if (board.parent === null) {
            board.printState();
            return recursions;
        }

        k = this.printPath(board.parent,recursions+1)
        board.printState()
        return k
    }

    public move(tileSeq){
        this.currentState = new State(tileSeq, this.currentState.depth + 1, this.currentState, this.goal)
        this.currentTileSeq = this.currentState.tileSeq;
    }
}