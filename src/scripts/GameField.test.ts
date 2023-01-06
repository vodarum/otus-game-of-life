import { GameField } from "./GameField";

describe("GameField", () => {
  describe("public interface", () => {
    it("is a class", () => {
      expect(GameField).toBeInstanceOf(Function);
      expect(new GameField(0, 0)).toBeInstanceOf(GameField);
    });

    it("has public methods", () => {
      const gameField = new GameField(0, 0);

      expect(gameField.getState).toBeInstanceOf(Function);
      expect(gameField.toggleCellState).toBeInstanceOf(Function);
      expect(gameField.nextGeneration).toBeInstanceOf(Function);
      expect(gameField.fillState).toBeInstanceOf(Function);
      expect(gameField.setSize).toBeInstanceOf(Function);
    });
  });

  describe("functional tests", () => {
    const [width, height] = [2, 3];

    let gameField: GameField;

    beforeEach(() => {
      gameField = new GameField(width, height);
    });

    it("supports settings side from constructor", () => {
      expect(gameField.getState()).toEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);
    });

    describe("has method .fillState", () => {
      it("random filling", () => {
        gameField.fillState();

        let cellsAlive = 0;
        let cellsDead = 0;

        gameField.getState().forEach((row) => {
          row.forEach((cell) => {
            if (cell) {
              cellsAlive++;
            } else {
              cellsDead++;
            }
          });
        });

        expect(cellsAlive).toBeGreaterThan(0);
        expect(cellsDead).toBeGreaterThan(0);
      });

      it("filling with dead cells", () => {
        gameField.fillState(0);
        expect(gameField.getState()).toEqual([
          [0, 0],
          [0, 0],
          [0, 0],
        ]);
      });

      it("filling with alive cells", () => {
        gameField.fillState(1);
        expect(gameField.getState()).toEqual([
          [1, 1],
          [1, 1],
          [1, 1],
        ]);
      });
    });

    it("has .toggleCellState method", () => {
      expect(gameField.toggleCellState).toBeInstanceOf(Function);

      const [x1, y1] = [0, 0];
      const [x2, y2] = [1, 2];

      gameField.toggleCellState(x1, y1);
      gameField.toggleCellState(x2, y2);

      expect(gameField.getState()).toEqual([
        [1, 0],
        [0, 0],
        [0, 1],
      ]);

      gameField.toggleCellState(x2, y2);

      expect(gameField.getState()).toEqual([
        [1, 0],
        [0, 0],
        [0, 0],
      ]);
    });

    it("has method .nextGeneration", () => {
      expect(gameField.nextGeneration).toBeInstanceOf(Function);

      const [x1, y1] = [0, 0];
      const [x2, y2] = [1, 2];

      gameField.toggleCellState(x1, y1);
      gameField.toggleCellState(x2, y2);

      expect(gameField.getState()).toEqual([
        [1, 0],
        [0, 0],
        [0, 1],
      ]);

      gameField.nextGeneration();

      expect(gameField.getState()).toEqual([
        [0, 0],
        [0, 0],
        [0, 0],
      ]);

      gameField.toggleCellState(0, 0);
      gameField.toggleCellState(1, 0);
      gameField.toggleCellState(0, 1);

      expect(gameField.getState()).toEqual([
        [1, 1],
        [1, 0],
        [0, 0],
      ]);

      gameField.nextGeneration();

      expect(gameField.getState()).toEqual([
        [1, 1],
        [1, 1],
        [0, 0],
      ]);
    });

    it("has method .setSize(newWidth, newHeight)", () => {
      gameField.toggleCellState(0, 0);
      gameField.toggleCellState(1, 1);
      gameField.toggleCellState(0, 2);

      expect(gameField.getState()).toEqual([
        [1, 0],
        [0, 1],
        [1, 0],
      ]);

      gameField.setSize(3, 4);

      expect(gameField.getState()).toEqual([
        [1, 0, 0],
        [0, 1, 0],
        [1, 0, 0],
        [0, 0, 0],
      ]);

      gameField.setSize(2, 2);

      expect(gameField.getState()).toEqual([
        [1, 0],
        [0, 1],
      ]);
    });
  });
});
