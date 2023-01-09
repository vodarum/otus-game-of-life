import { Game } from "./Game";
import { IGameField } from "./GameField";
import { IGameView } from "./GameView";
import { Cell } from "./types/Cell";

describe("Game", () => {
  const speed = 1;
  let state: Cell[][];
  let gameField: IGameField;
  let gameView: IGameView;
  let onGameStateChange = jest.fn();
  let onFieldSizeChange = jest.fn();
  let onCellClick = jest.fn();
  let onBtnNextClick = jest.fn();
  let onBtnRandomClick = jest.fn();
  let onBtnClearClick = jest.fn();
  let onSpeedChange = jest.fn();

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
    }),
    onBtnRandomClick: jest.fn((cb) => {
      onBtnRandomClick = jest.fn(cb);
    }),
    onBtnClearClick: jest.fn((cb) => {
      onBtnClearClick = jest.fn(cb);
    }),
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
      expect(gameView.updateGameState).toHaveBeenCalledWith({
        width,
        height,
      });
    });

    describe.each([true, false])(
      "calls field.nextGeneration on view.onBtnNextClick and renders with updated state",
      (isNextGeneration) => {
        it(`if field.nextGeneration returns '${isNextGeneration}'`, () => {
          state = getRandomlyFilledField(3, 4);

          const spyAlert = jest
            .spyOn(window, "alert")
            .mockImplementation(() => {
              /* do nothing */
            });
          const spyNextGeneration = jest
            .spyOn(gameField, "nextGeneration")
            .mockReturnValueOnce(isNextGeneration);

          onBtnNextClick();
          expect(spyNextGeneration).toHaveBeenCalledTimes(1);
          expect(gameField.getState).toHaveBeenCalled();
          expect(gameView.updateGameField).toHaveBeenCalledWith(state);

          if (isNextGeneration) {
            expect(spyAlert).toHaveBeenCalledTimes(0);
          } else {
            expect(spyAlert).toHaveBeenCalledWith("Игра окончена!");
          }
        });
      }
    );

    it("calls field.fillState on view.onBtnRandomClick and renders with updated state", () => {
      state = getRandomlyFilledField(3, 4);

      onBtnRandomClick();
      expect(gameField.fillState).toHaveBeenCalledWith(undefined);
      expect(gameField.getState).toHaveBeenCalled();
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
    });

    it("calls field.fillState on view.onBtnClearClick and renders with updated state", () => {
      state = getRandomlyFilledField(3, 4);

      onBtnClearClick();
      expect(gameField.fillState).toHaveBeenCalledWith(0);
      expect(gameField.getState).toHaveBeenCalled();
      expect(gameView.updateGameField).toHaveBeenCalledWith(state);
    });

    describe.each([1.5, 0.5, 1.0])(
      "updates state on view.onSpeedChange",
      (newSpeed) => {
        it(`with speed '${newSpeed}'`, () => {
          onSpeedChange(newSpeed);
          expect(gameView.updateGameState).toHaveBeenCalledWith({ newSpeed });
        });
      }
    );

    it("is able to start/stop game with onGameStateChange", () => {
      let isRunning = true;

      onGameStateChange(isRunning);
      expect(gameView.updateGameState).toHaveBeenCalledWith({ isRunning });

      isRunning = false;

      onGameStateChange(isRunning);
      expect(gameView.updateGameState).toHaveBeenCalledWith({ isRunning });
    });
  });
});
