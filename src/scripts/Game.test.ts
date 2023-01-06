import { Game } from "./Game";
import { IGameField } from "./GameField";
import { IGameView } from "./GameView";
import { Cell } from "./types/Cell";

/* eslint-disable-next-line */
const sleep = (x: number) => new Promise((resolve) => setTimeout(resolve, x));

describe("Game", () => {
  const speed = 1;
  let state: Cell[][];
  let gameField: IGameField;
  let gameView: IGameView;
  let onGameStateChange = jest.fn();
  let onFieldSizeChange = jest.fn();
  let onCellClick = jest.fn();
  let onBtnNextClick = jest.fn(); // ???
  let onBtnRandomClick = jest.fn(); // ???
  let onBtnClearClick = jest.fn(); // ???
  let onSpeedChange = jest.fn(); // ???

  const getGameField = (): IGameField => ({
    getState: jest.fn(() => state),
    toggleCellState: jest.fn(),
    nextGeneration: jest.fn(),
    setSize: jest.fn(),
    fillState: jest.fn(),
  });

  const getGameView = (): IGameView => ({
    updateGameField: jest.fn(),
    updateGameState: jest.fn(),
    onCellClick: jest.fn((cb) => {
      onCellClick = jest.fn(cb);
    }),
    onBtnNextClick: jest.fn((cb) => {
      onBtnNextClick = jest.fn(cb);
    }), // ???
    onBtnRandomClick: jest.fn((cb) => {
      onBtnRandomClick = jest.fn(cb);
    }), // ???
    onBtnClearClick: jest.fn((cb) => {
      onBtnClearClick = jest.fn(cb);
    }), // ???
    onGameStateChange: jest.fn((cb) => {
      onGameStateChange = jest.fn(cb);
    }),
    onFieldSizeChange: jest.fn((cb) => {
      onFieldSizeChange = jest.fn(cb);
    }),
    onSpeedChange: jest.fn((cb) => {
      onSpeedChange = jest.fn(cb);
    }),
  });

  const getRandomlyFilledField = (width: number, height: number): Cell[][] => {
    const field: Cell[][] = [[]];

    for (let y = 0; y < height; y++) {
      field[y] = [];

      for (let x = 0; x < width; x++) {
        field[y][x] = Math.round(Math.random()) as Cell;
      }
    }

    return field;
  };

  beforeEach(() => {
    state = getRandomlyFilledField(2, 3);
    gameView = getGameView();
    gameField = getGameField();
  });

  it("is a class", () => {
    expect(Game).toBeInstanceOf(Function);
    expect(new Game(gameField, gameView)).toBeInstanceOf(Game);
  });

  describe("functionality", () => {
    let game: Game;

    beforeEach(() => {
      game = new Game(gameField, gameView, speed);
    });

    it("renders initial state on instantiating", () => {
      expect(gameField.getState).toHaveBeenCalled();
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
      expect(gameView.updateGameState).toHaveBeenCalledWith({
        width: state[0].length,
        height: state.length,
        speed,
      });
    });

    it("calls field.toggleCellState on view.onCellClick and renders with updated state", () => {
      state = getRandomlyFilledField(3, 1);
      onCellClick(0, 1);
      expect(gameField.toggleCellState).toHaveBeenCalledWith(0, 1);
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
    });

    it("calls field.setSize on view.onFieldSizeChange and renders with updated state", () => {
      state = getRandomlyFilledField(3, 4);

      const width = state[0].length;
      const height = state.length;

      onFieldSizeChange(width, height);
      expect(gameField.setSize).toHaveBeenCalledWith(width, height);
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
      expect(gameView.updateGameState).toHaveBeenCalledWith(
        expect.objectContaining({
          width,
          height,
        })
      );
    });

    it.skip("is able to start/stop game with onGameStateChange", async () => {
      // https://github.com/codesandbox/codesandbox-client/issues/513
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);
      await sleep(speed);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      await sleep(speed);
      expect(gameField.getState).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(1);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(0);

      onGameStateChange(true);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(1);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(2);
      await sleep(speed);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(2);
      expect(gameField.getState).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(3);
      await sleep(speed);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameField.getState).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      onGameStateChange(false);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);
      await sleep(speed);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(3);
      expect(gameField.getState).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      await sleep(speed);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);
      // expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
      expect(gameField.getState).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      await sleep(speed);
      // expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
      expect(gameField.getState).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(5);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(3);

      onGameStateChange(true);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(4);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);
      expect(gameField.getState).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(6);
      await sleep(speed);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(5);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);
      expect(gameField.getState).toHaveBeenCalledTimes(7);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(7);
      await sleep(speed);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameField.getState).toHaveBeenCalledTimes(8);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(8);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(4);

      onGameStateChange(false);

      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
      await sleep(speed);
      expect(gameField.getState).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(9);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
      await sleep(speed);
      expect(gameField.getState).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameField).toHaveBeenCalledTimes(9);
      expect(gameView.updateGameState).toHaveBeenCalledTimes(5);
      expect(gameField.nextGeneration).toHaveBeenCalledTimes(6);
    });
  });
});
