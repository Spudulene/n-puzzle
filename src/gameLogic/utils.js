const { State } = require('./State.ts')


// Generate random start board and goal board based on desired size
export function generateStartBoard(size) {
    let startState = Array.from({ length: size }, () => Array(size).fill(0));
    let nums = Array.from({ length: size * size }, (_, i) => i);

    // Shuffle the numbers
    nums = nums.sort(() => Math.random() - 0.5);

    let row = -1;
    for (let n of nums.entries()) {
        row = n[0] % size === 0 ? row + 1 : row;
        startState[row][n[0] % size] = n[1];
    }

    return new State(startState,0,null)
}

export function generateGoalBoard(size) {
    let goalState = Array.from({ length: size }, () => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            goalState[i][j] = ((i * size) + j + 1) % (size * size);
        }
    }
    
    return new State(goalState, 0, null)
}

export function isSolvable(start, size) {
    let inversions = 0;
    let emptyValue = 0;
    let temp = [];

    // Flatten the start state
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            temp.push(start[i][j]);
        }
    }

    // Count inversions
    for (let i = 0; i < size * size; i++) {
        for (let j = i + 1; j < size * size; j++) {
            if (temp[j] !== emptyValue && temp[i] !== emptyValue && temp[i] > temp[j]) {
                inversions++;
            }
        }
    }

    return inversions % 2 === 0;  // Solvable if the number of inversions is even
}

export default (generateStartBoard, generateGoalBoard, isSolvable)