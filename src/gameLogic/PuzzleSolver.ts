
import { PriorityQueue } from "./PriorityQueue.js";
import { State } from "./State.ts"
import { Game } from "./Game.ts"

export class PuzzleSolver{
    private closed : State[] = []
    private heuristic : string;
    private game : Game;
    private pq = new PriorityQueue();
    private start : State;
    private goal : State;

    // creates a new solver object that solves using the desired heuristic
    public constructor(game: Game, heuristic : string){
        this.game = game;
        this.heuristic = heuristic;
        this.start = this.game.start;
        this.goal = this.game.goal;
    }

    // solves the puzzle from its start State
    public solve(){
        let flag : number[];
        let min : State;
        let children : State[];
        this.start.calculateCost(this.heuristic);
        this.pq.put(this.start);
        let solutionPath : State[] = [];

        // while there are States in the priority queue
        while (!this.pq.empty()){
            // get the lowest cost State
            min = this.pq.get()
            // if it equals the goal, stop
            if (min.equals(this.goal)) {
                let currentState = min;
                // go through each parent to get the solution path
                while (currentState.parent != null){
                    solutionPath.push(currentState);
                    currentState = currentState.parent;
                }
                
                //reverse it for displaying
                return solutionPath.reverse();
            }
            
            else{
                // put the State into the closed array and get the possible children
                this.closed.push(min);
                children = min.generateChildren();
                children = children.sort(() => Math.random() - 0.5);

                // for each child, find out if it is currently in open or closed.
                // if there are some that have are higher or lower in the solution tree,
                // update to the ones with lower depths
                children.forEach((child) =>{
                    flag = child.checkInclusive(this.pq, this.closed);
                    switch (flag[0]){
                        case 0:
                            child.calculateCost(this.heuristic);
                            this.pq.put(child);
                            break;
                        case 1:
                            child.depth = flag[1];
                            break;
                        case 2:
                            this.closed[flag[1]].calculateCost(this.heuristic);
                            this.pq.put(this.closed[flag[1]]);
                            this.closed.splice(flag[1],1);
                    }
                })
            }
        }
    }
}