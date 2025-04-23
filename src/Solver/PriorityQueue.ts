// min-heap implementation for priority queue to increase efficiency
export class PriorityQueue<T> {
    private heap: { cost: number, item: T }[] = [];

    // adds item to the array and moves it into position
    put(item: T, cost: number) {
        this.heap.push({ cost, item });
        this.bubbleUp(this.heap.length - 1);
    }

    // gets the first (lowest cost) state and repositions the other states
    get(): { cost: number, item: T } {
        if (this.heap.length === 0) throw new Error("PriorityQueue is empty");
        // store the root and remove the last item in the heap
        const min = this.heap[0];
        const end = this.heap.pop()!;

        // make sure there are items in the heap
        if (this.heap.length > 0) {
            // replace the root with the end and move it down to its proper position
            this.heap[0] = end;
            this.sinkDown(0);
        }
        return min;
    }

    // returns if the heap is empty
    empty(): boolean {
        return this.heap.length === 0;
    }

    // moves a newly added item from the bottom up to preserve the heap structure
    private bubbleUp(n: number) {
        const element = this.heap[n];
        while (n > 0) {
            // get the index of the current element's parent and the parent
            const parentN = Math.floor((n + 1) / 2) - 1;
            const parent = this.heap[parentN];
            // if the element > parent, we don't move it up the heap
            if (element.cost >= parent.cost) break;
            // else, we swap the parent and the current element and move up the heap
            this.heap[parentN] = element;
            this.heap[n] = parent;
            n = parentN;
        }
    }

    // restores the heap after the root has been removed
    private sinkDown(n: number) {
        const length = this.heap.length;
        const element = this.heap[n];

        while (true) {
            // get the indices of the children of the current element
            let child1N = 2 * n + 1;
            let child2N = 2 * n + 2;
            let swap: number | null = null;

            // make sure the the index is actually in the array
            if (child1N < length) {
                const child1 = this.heap[child1N];
                // if first child < element, then set the swap index as first child
                if (child1.cost < element.cost) swap = child1N;
            }

            // make sure the index is actually in the array
            if (child2N < length) {
                const child2 = this.heap[child2N];
                // if first child is not swap element but second child < element
                // or if first child is swap but second child < first child
                // set swap index as second child
                if ((swap === null && child2.cost < element.cost) ||
                    (swap !== null && child2.cost < this.heap[child1N].cost)) {
                    swap = child2N;
                }
            }

            // if the swap index is still null, the item has been pushed
            // down as far as it needs to and we stop
            if (swap === null) break;

            // perform the swap
            this.heap[n] = this.heap[swap];
            this.heap[swap] = element;
            n = swap;
        }
    }
}