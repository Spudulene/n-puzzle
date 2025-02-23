export class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    // Add an element to the queue
    put(item) {
        this.queue.push(item);
        this.queue.sort((a, b) => a.cost - b.cost);  // Sort by cost (ascending)
    }

    // Get the element with the lowest cost
    get() {
        return this.queue.shift();  // Remove and return the first item in the queue
    }

    // Check if the queue is empty
    empty() {
        return this.queue.length === 0;
    }

    size() {
        return this.queue.length;
    }

    at(index) {
        return this.queue[index];
    }
}
