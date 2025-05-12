import { PriorityQueue } from "./PriorityQueue.ts";
import { State } from "../gameLogic/State.ts";
import { Game } from "../gameLogic/Game.ts";

export class Solver {
    private heuristic: string;
    private game: Game;
    private pq = new PriorityQueue<State>();
    private visited: Set<string> = new Set();
    private start: State;
    private goal: State;

    // creates a new solver object and initailizes all variables
    constructor(game: Game, heuristic: string) {
        this.game = game;
        this.heuristic = heuristic;
        this.start = this.game.currentState;
        this.goal = this.game.goal;
    }

    // solves the puzzle and returns the solution path
    public solve(): State[] | undefined {
        const solutionPath: State[] = [];

        // calculate the cost of the start state and put it into the min-heap
        this.start.calculateCost(this.heuristic);
        this.pq.put(this.start, this.start.getCost());

        // as long as there is something to get from the heap, keep going
        while (!this.pq.empty()) {
            // get the item with the lowest cost and generate it's string hash for storing 
            // in the visited set
            const { item: current } = this.pq.get();
            const hash = current.getHash();

            // if the set already has the current State's hash, we don't need to add it
            // or generate its children
            if (this.visited.has(hash)) continue;

            // otherwise, we add the hash to the set and continue
            this.visited.add(hash);

            // if the current State is the goal, we stop and generate the
            // solution path
            if (current.equals(this.goal)) {
                let curr = current;
                // backtrack through the parents to find the solution path
                while (curr.parent && !this.start.equals(curr)) {
                    solutionPath.push(curr);
                    curr = curr.parent;
                }
                
                // reverse it for displaying in the UI
                return solutionPath.reverse();
            }

            // get possivble children
            let children = current.generateChildren();

            for (const child of children) {
                // get the hash of the child and check if it has already been visited
                // if it has, do not add it to the heap (there's no reason to go back to a previously visited state)
                const childHash = child.getHash();
                if (this.visited.has(childHash)) continue;

                // calculate the cost and add it to the heap
                child.calculateCost(this.heuristic);
                this.pq.put(child, child.getCost());
            }
        }
    }
}
