export class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    // add an element to the queue
    put(item) {
        this.queue.push(item);
        this.queue.sort((a, b) => a.cost - b.cost);  // Sort by cost
    }

    // get the element with the lowest cost
    get() {
        return this.queue.shift();  // remove and return the first item in the queue
    }

    // check if the queue is empty
    empty() {
        return this.queue.length === 0;
    }

    // return the size of the queue
    size() {
        return this.queue.length;
    }

    // peek at a given index
    at(index) {
        return this.queue[index];
    }
}
