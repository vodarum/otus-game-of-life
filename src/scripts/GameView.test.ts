import { GameView } from "./GameView";

describe("GameView", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
  });

  describe("public interface", () => {
    it("is a class", () => {
      expect(GameView).toBeInstanceOf(Function);
      expect(new GameView(el)).toBeInstanceOf(GameView);
    });

    it("renders some inital markup on construction", () => {
      expect(el.classList.contains("game")).toBeFalsy();

      /* eslint-disable-next-line */
      new GameView(el);
      expect(el.classList.contains("game")).toBeTruthy();
      expect(el.querySelector(".game__title")).not.toBeNull();
      expect(el.querySelector(".game__field")).not.toBeNull();
      expect(el.querySelector(".game__controls")).not.toBeNull();
    });

    it("has public methods", () => {
      const gameView = new GameView(el);
      expect(gameView.updateGameField).toBeInstanceOf(Function);
      expect(gameView.updateGameState).toBeInstanceOf(Function);
      expect(gameView.onCellClick).toBeInstanceOf(Function);
      expect(gameView.onGameStateChange).toBeInstanceOf(Function);
      expect(gameView.onFieldSizeChange).toBeInstanceOf(Function);
      expect(gameView.onBtnNextClick).toBeInstanceOf(Function);
      expect(gameView.onBtnRandomClick).toBeInstanceOf(Function);
      expect(gameView.onBtnClearClick).toBeInstanceOf(Function);
      expect(gameView.onSpeedChange).toBeInstanceOf(Function);
    });
  });

  describe("functional interface", () => {
    let gameView: GameView;

    beforeEach(() => {
      gameView = new GameView(el);
    });

    it("renders field from .updateGameField", () => {
      gameView.updateGameField([
        [0, 1],
        [1, 0],
      ]);

      expect(el.querySelectorAll(".cell").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell_alive").length).toBe(2);
      expect(el.querySelectorAll(".cell.cell_dead").length).toBe(2);

      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);

      expect(el.querySelectorAll(".cell").length).toBe(4);
      expect(el.querySelectorAll(".cell.cell_alive").length).toBe(1);
      expect(el.querySelectorAll(".cell.cell_dead").length).toBe(3);

      gameView.updateGameField([
        [0, 0, 1],
        [1, 0, 1],
      ]);

      expect(el.querySelectorAll(".cell").length).toBe(6);
      expect(el.querySelectorAll(".cell.cell_alive").length).toBe(3);
      expect(el.querySelectorAll(".cell.cell_dead").length).toBe(3);
    });

    it("renders correct game state on .updateGameState", () => {
      const btnRun = el.querySelector("#btnRun") as HTMLButtonElement;
      const inputWidth = el.querySelector("#inputWidth") as HTMLInputElement;
      const inputHeight = el.querySelector("#inputHeight") as HTMLInputElement;
      const inputSpeed = el.querySelector("#inputSpeed") as HTMLInputElement;

      expect(btnRun.classList.contains("btn-run_play")).toBeTruthy();
      expect(btnRun.innerHTML).toBe("Play");

      gameView.updateGameState({
        width: 3,
        height: 3,
        speed: 1,
        isRunning: true,
      });

      expect(btnRun.classList.contains("btn-run_play")).toBeFalsy();
      expect(btnRun.classList.contains("btn-run_stop")).toBeTruthy();
      expect(btnRun.innerHTML).toBe("Stop");
      expect(Number(inputWidth.value)).toBe(3);
      expect(Number(inputHeight.value)).toBe(3);
      expect(Number(inputSpeed.value)).toBe(1);

      gameView.updateGameState({ width: 5, height: 6, isRunning: false });

      expect(btnRun.classList.contains("btn-run_stop")).toBeFalsy();
      expect(btnRun.classList.contains("btn-run_play")).toBeTruthy();
      expect(btnRun.innerHTML).toBe("Play");
      expect(Number(inputWidth.value)).toBe(5);
      expect(Number(inputHeight.value)).toBe(6);

      gameView.updateGameState({ width: 4, height: 4, speed: 0.5 });

      expect(btnRun.classList.contains("btn-run_stop")).toBeFalsy();
      expect(btnRun.classList.contains("btn-run_play")).toBeTruthy();
      expect(btnRun.innerHTML).toBe("Play");
      expect(Number(inputWidth.value)).toBe(4);
      expect(Number(inputHeight.value)).toBe(4);
      expect(Number(inputSpeed.value)).toBe(0.5);
    });

    it("enables/disables of buttons on game field change", () => {
      const btnRun = el.querySelector("#btnRun") as HTMLButtonElement;
      const btnNext = el.querySelector("#btnNext") as HTMLButtonElement;
      const btnClear = el.querySelector("#btnClear") as HTMLButtonElement;

      expect(btnRun.disabled).toBeTruthy();
      expect(btnNext.disabled).toBeTruthy();
      expect(btnClear.disabled).toBeTruthy();

      gameView.updateGameField([
        [0, 1],
        [0, 0],
      ]);

      expect(btnRun.disabled).toBeFalsy();
      expect(btnNext.disabled).toBeFalsy();
      expect(btnClear.disabled).toBeFalsy();

      gameView.updateGameField([
        [0, 0],
        [0, 0],
      ]);

      expect(btnRun.disabled).toBeTruthy();
      expect(btnNext.disabled).toBeTruthy();
      expect(btnClear.disabled).toBeTruthy();
    });

    it("calls funciton from .onCellClick on field interaction", () => {
      const onCellClick = jest.fn();
      gameView.onCellClick(onCellClick);
      gameView.updateGameField([
        [0, 0],
        [1, 0],
      ]);

      (el.querySelector(".cell.cell_alive") as Element).dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onCellClick).toHaveBeenCalledWith(0, 1);

      (el.querySelectorAll(".cell.cell_dead")[1] as Element).dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onCellClick).toHaveBeenCalledWith(1, 0);
    });

    it("calls function from .onGameStateChange on control interaction", () => {
      const onGameStateChange = jest.fn();

      gameView.onGameStateChange(onGameStateChange);
      gameView.updateGameState({ isRunning: true, width: 2, height: 1 });

      (el.querySelector("#btnRun") as HTMLButtonElement).dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onGameStateChange).toHaveBeenCalledWith(false);
      gameView.updateGameState({ isRunning: false, width: 2, height: 1 });
      (el.querySelector("#btnRun") as HTMLButtonElement).dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onGameStateChange).toHaveBeenCalledWith(true);
    });

    it("calls function from .onFieldSizeChange on field size change interaction", () => {
      const onFieldSizeChange = jest.fn();
      gameView.onFieldSizeChange(onFieldSizeChange);

      [
        [33, 66],
        [22, 12],
        [1, 2],
      ].forEach(([width, height]) => {
        const inputWidth = el.querySelector("#inputWidth") as HTMLInputElement;
        const inputHeight = el.querySelector(
          "#inputHeight"
        ) as HTMLInputElement;

        inputWidth.value = `${width}`;
        inputHeight.value = `${height}`;
        inputWidth.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );
        expect(onFieldSizeChange).toHaveBeenCalledWith(width, height);
      });

      [
        [101, 103],
        [104, 105],
        [106, 107],
      ].forEach(([width, height]) => {
        const inputWidth = el.querySelector("#inputWidth") as HTMLInputElement;
        const inputHeight = el.querySelector(
          "#inputHeight"
        ) as HTMLInputElement;

        inputWidth.value = `${width}`;
        inputHeight.value = `${height}`;
        inputHeight.dispatchEvent(
          new Event("change", {
            bubbles: true,
          })
        );
        expect(onFieldSizeChange).toHaveBeenCalledWith(width, height);
      });
    });

    it("calls function from .onBtnNextClick on control interaction", () => {
      const onBtnNextClick = jest.fn();

      gameView.onBtnNextClick(onBtnNextClick);

      (el.querySelector("#btnNext") as HTMLButtonElement).dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onBtnNextClick).toHaveBeenCalledTimes(1);
    });

    it("calls function from .onBtnRandomClick on control interaction", () => {
      const onBtnRandomClick = jest.fn();

      gameView.onBtnRandomClick(onBtnRandomClick);

      (el.querySelector("#btnRandom") as HTMLButtonElement).dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onBtnRandomClick).toHaveBeenCalledTimes(1);
    });

    it("calls function from .onBtnClearClick on control interaction", () => {
      const onBtnClearClick = jest.fn();

      gameView.onBtnClearClick(onBtnClearClick);

      (el.querySelector("#btnClear") as HTMLButtonElement).dispatchEvent(
        new Event("click", {
          bubbles: true,
        })
      );
      expect(onBtnClearClick).toHaveBeenCalledTimes(1);
    });

    it("calls function from .onSpeedChange on control interaction", () => {
      const onSpeedChange = jest.fn();

      gameView.onSpeedChange(onSpeedChange);

      (el.querySelector("#inputSpeed") as HTMLInputElement).dispatchEvent(
        new Event("input", {
          bubbles: true,
        })
      );
      expect(onSpeedChange).toHaveBeenCalledTimes(1);
    });
  });
});
