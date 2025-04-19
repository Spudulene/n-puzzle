export class State {
    public tiles: number[];
    public depth: number;
    public parent: State | null;
    public emptyIndex: number;
    private goal: State | null;
    private cost: number = 0;
    public size: number;

    constructor(tiles: number[], depth: number, parent: State | null, goal: State | null, size: number) {
        this.tiles = tiles;
        this.depth = depth;
        this.parent = parent;
        this.goal = goal;
        this.size = size;
        this.emptyIndex = this.tiles.indexOf(0);
    }

    public equals(other: State | null): boolean {
        if (!other) return false;
        return this.tiles.every((val, i) => val === other.tiles[i]);
    }

    public calculateCost(heuristic: string) {
        switch (heuristic) {
            case "WALKING DISTANCE":
                this.cost = this.calculateWalkingDistance();
                break;
            default:
                this.cost = this.depth;
        }
    }

    private calculateWalkingDistance(): number {
        if (!this.goal) return 0;
        let total = 0;
        for (let i = 0; i < this.tiles.length; i++) {
            const val = this.tiles[i];
            if (val === 0) continue;
            const currRow = Math.floor(i / this.size);
            const currCol = i % this.size;
            const goalIdx = this.goal.tiles.indexOf(val);
            const goalRow = Math.floor(goalIdx / this.size);
            const goalCol = goalIdx % this.size;
            total += Math.abs(currRow - goalRow) + Math.abs(currCol - goalCol);
        }
        return total;
    }

    public getCost(): number {
        return this.cost;
    }

    public generateChildren(): State[] {
        const children: State[] = [];
        const row = Math.floor(this.emptyIndex / this.size);
        const col = this.emptyIndex % this.size;

        const moves = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        for (const [dRow, dCol] of moves) {
            const newRow = row + dRow;
            const newCol = col + dCol;
            if (newRow < 0 || newCol < 0 || newRow >= this.size || newCol >= this.size) continue;

            const newIndex = newRow * this.size + newCol;
            const newTiles = [...this.tiles];
            [newTiles[this.emptyIndex], newTiles[newIndex]] = [newTiles[newIndex], newTiles[this.emptyIndex]];
            const child = new State(newTiles, this.depth + 1, this, this.goal, this.size);
            if (!this.parent || !child.equals(this.parent)) {
                children.push(child);
            }
        }

        return children;
    }

    public getHash(): string {
        return this.tiles.join(",");
    }

    static fromData(data: any) {
        const state = new State(data.tiles, data.depth, data.parent, data.goal, data.size);
        state.emptyIndex = data.emptyIndex;
        return state;
      }
}

