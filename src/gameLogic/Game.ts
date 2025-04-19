import { State } from './State.ts';

export class Game {
    public size: number;
    public start: State;
    public goal: State;
    public currentState: State;
    public tiles: number[];
    public completed = false;

    constructor(size: number) {
        this.size = size;
        this.goal = this.generateGoalBoard();
        this.start = this.generateStartBoard();
        this.currentState = this.start;
        this.tiles = this.start.tiles;
    }

    private generateStartBoard(): State {
        let nums = Array.from({ length: this.size * this.size }, (_, i) => i);
        do {
            nums = nums.sort(() => Math.random() - 0.5);
        } while (!this.isSolvable(nums));

        return new State(nums, 0, null, this.goal, this.size);
    }

    private generateGoalBoard(): State {
        const goal = Array.from({ length: this.size * this.size }, (_, i) => (i + 1) % (this.size * this.size));
        return new State(goal, 0, null, null, this.size);
    }

    private isSolvable(tiles: number[]): boolean {
        let inversions = 0;
        for (let i = 0; i < tiles.length; i++) {
          for (let j = i + 1; j < tiles.length; j++) {
            if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) inversions++;
          }
        }
    
        if (this.size % 2 === 1) {
          return inversions % 2 === 0;
        } else {
          const rowFromBottom = this.size - Math.floor(tiles.indexOf(0) / this.size);
          return (inversions + rowFromBottom) % 2 === 0;
        }
      }

    public move(tiles: number[]) {
        this.currentState = new State(tiles, this.currentState.depth + 1, this.currentState, this.goal, this.size);
        this.tiles = tiles;
        this.completed = this.currentState.equals(this.goal);
    }

    public clone(): Game {
        const g = new Game(this.size);
        g.start = new State([...this.start.tiles], 0, null, this.goal, this.size);
        g.goal = new State([...this.goal.tiles], 0, null, null, this.size);
        g.currentState = new State([...this.tiles], 0, null, this.goal, this.size);
        g.tiles = [...this.tiles];
        g.completed = this.completed;
        return g;
    }

    static fromData(data: any) {
        const game = new Game(data.size);
        game.currentState = State.fromData(data.currentState);
        game.goal = State.fromData(data.goal);
        game.tiles = data.tiles;
        game.start = State.fromData(data.currentState)
        return game;
    } 
}
