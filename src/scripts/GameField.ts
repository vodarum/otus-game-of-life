import { Cell } from "./types/Cell";

export interface IGameField {
  getState(): Cell[][];
  toggleCellState(x: number, y: number): void;
  nextGeneration(): boolean;
  fillState(cellValue?: 0 | 1): void;
  setSize(width: number, height: number): void;
}

export class GameField implements IGameField {
  private width: number;

  private height: number;

  private state: Cell[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.state = GameField.initState(width, height);
  }

  checkIfOutsideField(x: number, y: number) {
    return x < 0 || y < 0 || x >= this.width || y >= this.height;
  }

  fillState(cellValue?: 0 | 1) {
    if (typeof cellValue !== "undefined") {
      this.state = this.state.map((row) => row.map((cell) => cellValue));
      return;
    }

    this.state = this.state.map((row) =>
      row.map((cell) => Math.round(Math.random()) as Cell)
    );
  }

  getLivingNeighborCount(x: number, y: number) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const [x1, y1] = [x + j, y + i];

        if (this.checkIfOutsideField(x1, y1)) {
          continue;
        }

        if (x1 === x && y1 === y) {
          continue;
        }

        if (this.state[y1][x1]) {
          count++;
        }
      }
    }

    return count;
  }

  getState() {
    return this.state;
  }

  nextGeneration(): boolean {
    const newState: Cell[][] = [[]];

    for (let y = 0; y < this.height; y++) {
      newState[y] = [];

      for (let x = 0; x < this.width; x++) {
        const livingNeighborCount = this.getLivingNeighborCount(x, y);

        if (!this.state[y][x] && livingNeighborCount === 3) {
          newState[y][x] = 1;
          continue;
        }

        if (
          this.state[y][x] &&
          (livingNeighborCount < 2 || livingNeighborCount > 3)
        ) {
          newState[y][x] = 0;
          continue;
        }

        newState[y][x] = this.state[y][x];
      }
    }

    console.log(newState);

    if (
      GameField.arraysEqual(this.state, newState) ||
      GameField.arrayIsEmpty(newState)
    ) {
      this.state = GameField.initState(this.width, this.height);
      return false;
    }

    this.state = newState;
    return true;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    const newState: Cell[][] = [[]];

    for (let y = 0; y < height; y++) {
      newState[y] = [];

      for (let x = 0; x < width; x++) {
        newState[y][x] = Array.isArray(this.state[y])
          ? (+!!this.state[y][x] as Cell)
          : 0;
      }
    }

    this.state = newState;
  }

  toggleCellState(x: number, y: number) {
    this.state[y][x] = +!this.state[y][x] as Cell;
  }

  private static arraysEqual(arr1: Cell[][], arr2: Cell[][]) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  private static arrayIsEmpty(arr: Cell[][]) {
    return !arr.find((innerArr) => innerArr.find((item) => item));
  }

  private static initState(width: number, height: number) {
    const newState: Cell[][] = [[]];

    for (let y = 0; y < height; y++) {
      newState[y] = [];

      for (let x = 0; x < width; x++) {
        newState[y][x] = 0;
      }
    }

    return newState;
  }
}
