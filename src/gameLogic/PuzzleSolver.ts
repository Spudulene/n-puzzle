
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

    public constructor(game: Game, heuristic : string){
        this.game = game;
        this.heuristic = heuristic;
        this.start = this.game.start;
        this.goal = this.game.goal;
    }

    public solve(){
        let flag : number[];
        let min : State;
        let children : State[];
        this.start.calculateCost(this.heuristic);
        this.pq.put(this.start);

        while (!this.pq.empty()){
            console.log(this.pq)
            min = this.pq.get()
            if (min.equals(this.goal)) {
                return this.game.printPath(min,0)
            }
            
            else{
                this.closed.push(min);
                children = min.generateChildren()
                children = children.sort(() => Math.random() - 0.5);
                children.forEach((child) =>{
                    flag = child.checkInclusive(this.pq, this.closed)
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