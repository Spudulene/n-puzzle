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

    constructor(game: Game, heuristic: string) {
        this.game = game;
        this.heuristic = heuristic;
        this.start = this.game.start;
        this.goal = this.game.goal;
    }

    public solve(): State[] | undefined {
        this.start.calculateCost(this.heuristic);
        this.pq.put(this.start, this.start.getCost());
        const solutionPath: State[] = [];

        while (!this.pq.empty()) {
            const { item: current } = this.pq.get();
            const hash = current.getHash();

            if (this.visited.has(hash)) continue;
            this.visited.add(hash);

            if (current.equals(this.goal)) {
                let curr = current;
                while (curr.parent) {
                    solutionPath.push(curr);
                    curr = curr.parent;
                }
                return solutionPath.reverse();
            }

            let children = current.generateChildren().sort(() => Math.random() - 0.5);

            for (const child of children) {
                const childHash = child.getHash();
                if (this.visited.has(childHash)) continue;

                child.calculateCost(this.heuristic);
                this.pq.put(child, child.getCost());
            }
        }

        return [];
    }

}
