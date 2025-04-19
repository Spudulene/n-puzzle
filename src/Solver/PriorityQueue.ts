export class PriorityQueue<T> {
    private heap: { cost: number, item: T }[] = [];

    put(item: T, cost: number) {
        this.heap.push({ cost, item });
        this.bubbleUp(this.heap.length - 1);
    }

    get(): { cost: number, item: T } {
        if (this.heap.length === 0) throw new Error("PriorityQueue is empty");
        const min = this.heap[0];
        const end = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this.sinkDown(0);
        }
        return min;
    }

    empty(): boolean {
        return this.heap.length === 0;
    }

    private bubbleUp(n: number) {
        const element = this.heap[n];
        while (n > 0) {
            const parentN = Math.floor((n + 1) / 2) - 1;
            const parent = this.heap[parentN];
            if (element.cost >= parent.cost) break;
            this.heap[parentN] = element;
            this.heap[n] = parent;
            n = parentN;
        }
    }

    private sinkDown(n: number) {
        const length = this.heap.length;
        const element = this.heap[n];

        while (true) {
            let child1N = 2 * n + 1;
            let child2N = 2 * n + 2;
            let swap: number | null = null;

            if (child1N < length) {
                const child1 = this.heap[child1N];
                if (child1.cost < element.cost) swap = child1N;
            }

            if (child2N < length) {
                const child2 = this.heap[child2N];
                if ((swap === null && child2.cost < element.cost) ||
                    (swap !== null && child2.cost < this.heap[child1N].cost)) {
                    swap = child2N;
                }
            }

            if (swap === null) break;
            this.heap[n] = this.heap[swap];
            this.heap[swap] = element;
            n = swap;
        }
    }
}