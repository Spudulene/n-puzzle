import { State } from './State.ts';

export class Game {
    public size: number;
    public start: State;
    public goal: State;
    public currentState: State;
    public tiles: number[];
    public completed = false;

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

    // checks if the tiles passed to it are solvable
    private isSolvable(tiles: number[]): boolean {
        let inversions = 0;
        // count the number of inversions
        for (let i = 0; i < tiles.length; i++) {
          for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inversions++;
          }
        }
    
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
