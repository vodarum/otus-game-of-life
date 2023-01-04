import { Cell } from "./types/Cell";

export interface IGameView {
  updateGameField(field: Cell[][]): void;
  updateGameState(state: {
    width?: number;
    height?: number;
    speed?: number;
    isRunning?: boolean;
  }): void;
  onCellClick(cb: (x: number, y: number) => void): void;
  onNextBtnClick(cb: () => void): void;
  onRandomBtnClick(cb: () => void): void;
  onClearBtnClick(cb: () => void): void;
  onGameStateChange(cb: (newState: boolean) => void): void;
  onSpeedChange(cb: (speed: number) => void): void;
  onFieldSizeChange(cb: (width: number, height: number) => void): void;
}

export class GameView implements IGameView {
  wrapper: HTMLElement;

  constructor(el: HTMLElement) {
    this.wrapper = el;

    this.addGameInterface();
  }

  private addGameInterface() {
    const gameField = document.createElement("table");
    gameField.classList.add("gameField");

    const gameControls = GameView.createGameControls();

    this.wrapper.append(gameField, gameControls);
  }

  updateGameField(field: Cell[][]) {
    const width: number = field[0].length;
    const height: number = field.length;

    const gameField = this.wrapper.querySelector(".gameField") as HTMLElement;
    const newGameField = gameField;
    newGameField.innerHTML = "";

    let allCellsAreDead = true;

    for (let y = 0; y < height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < width; x++) {
        const cell = document.createElement("td");
        cell.classList.add("cell");
        cell.classList.add(field[y][x] ? "cell--alive" : "cell--dead");

        cell.dataset.x = `${x}`;
        cell.dataset.y = `${y}`;

        if (allCellsAreDead && field[y][x]) {
          allCellsAreDead = false;
        }

        row.append(cell);
      }

      newGameField.append(row);
    }

    gameField.innerHTML = newGameField.innerHTML;
    this.toggleButtons(allCellsAreDead);
  }

  private toggleButtons(disabled: boolean) {
    const buttons = this.wrapper.querySelectorAll("button");

    Array.from(buttons).forEach((btn) => {
      if (btn.dataset.hasToggle) {
        /* eslint no-param-reassign: ["error", { "props": false }] */
        btn.disabled = disabled;
      }
    });
  }

  updateGameState(state: {
    width?: number;
    height?: number;
    speed?: number;
    isRunning?: boolean;
  }) {
    if (
      typeof state.width !== "undefined" &&
      typeof state.height !== "undefined"
    ) {
      this.updateFieldSizeControls(state.width, state.height);
    }

    if (typeof state.speed !== "undefined") {
      this.updateSpeedControl(state.speed);
    }

    if (typeof state.isRunning !== "undefined") {
      this.updateRunControl(state.isRunning);
    }
  }

  private updateFieldSizeControls(width: number, height: number) {
    const inputWidth = this.wrapper.querySelector(
      ".field-size--width"
    ) as HTMLInputElement;
    const inputHeight = this.wrapper.querySelector(
      ".field-size--height"
    ) as HTMLInputElement;

    inputWidth.value = `${width}`;
    inputHeight.value = `${height}`;
  }

  private updateSpeedControl(speed: number) {
    const inputSpeed = this.wrapper.querySelector("#speed") as HTMLInputElement;
    const outputSpeed = this.wrapper.querySelector(
      "output"
    ) as HTMLOutputElement;

    inputSpeed.value = speed.toFixed(1);
    outputSpeed.innerHTML = `${speed.toFixed(1)} s`;
  }

  private updateRunControl(isRunning: boolean) {
    const button = this.wrapper.querySelector(
      ".run-button"
    ) as HTMLButtonElement;

    if (isRunning) {
      button.classList.remove("run-button--stopped");
      button.classList.add("run-button--runned");

      button.innerHTML = "Stop";
    } else {
      button.classList.remove("run-button--runned");
      button.classList.add("run-button--stopped");

      button.innerHTML = "Play";
    }
  }

  onCellClick(cb: (x: number, y: number) => void) {
    this.wrapper.addEventListener("click", (e) => {
      const cell = e.target as HTMLElement;

      if (
        !cell.classList.contains("cell") ||
        typeof cell.dataset.x === "undefined" ||
        typeof cell.dataset.y === "undefined"
      ) {
        return;
      }

      cb(+cell.dataset.x, +cell.dataset.y);
    });
  }

  onGameStateChange(cb: (newState: boolean) => void) {
    const button = this.wrapper.querySelector(
      ".run-button"
    ) as HTMLButtonElement;

    button.addEventListener("click", () => {
      cb(button.innerHTML === "Play");
    });
  }

  onNextBtnClick(cb: () => void) {
    const button = this.wrapper.querySelector(
      ".next-button"
    ) as HTMLButtonElement;

    button.addEventListener("click", () => {
      cb();
    });
  }

  onRandomBtnClick(cb: () => void) {
    const button = this.wrapper.querySelector(
      ".random-button"
    ) as HTMLButtonElement;

    button.addEventListener("click", () => {
      cb();
    });
  }

  onClearBtnClick(cb: () => void) {
    const button = this.wrapper.querySelector(
      ".clear-button"
    ) as HTMLButtonElement;

    button.addEventListener("click", () => {
      cb();
    });
  }

  onSpeedChange(cb: (speed: number) => void) {
    const inputSpeed = this.wrapper.querySelector("#speed") as HTMLInputElement;

    inputSpeed.addEventListener("input", () => {
      cb(+inputSpeed.value);
    });
  }

  onFieldSizeChange(cb: (width: number, height: number) => void) {
    const inputWidth = this.wrapper.querySelector(
      ".field-size--width"
    ) as HTMLInputElement;
    const inputHeight = this.wrapper.querySelector(
      ".field-size--height"
    ) as HTMLInputElement;

    inputWidth.addEventListener("change", () => {
      cb(+inputWidth.value, +inputHeight.value);
    });

    inputHeight.addEventListener("change", () => {
      cb(+inputWidth.value, +inputHeight.value);
    });
  }

  private static createGameControls() {
    const gameControls = document.createElement("div");
    gameControls.classList.add("gameControls");

    const fieldSizeControls = GameView.createFieldSizeControls();
    const buttons = GameView.createButtons();
    const speedControl = GameView.createSpeedControl();

    gameControls.append(fieldSizeControls, buttons, speedControl);

    return gameControls;
  }

  private static createButtons() {
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");

    const buttonsContent = [
      {
        classes: ["run-button", "run-button--stopped"],
        text: "Play",
        disabled: true,
      },
      {
        classes: ["next-button"],
        text: "Next",
        disabled: true,
      },
      { classes: ["random-button"], text: "Random" },
      {
        classes: ["clear-button"],
        text: "Clear",
        disabled: true,
      },
    ];

    buttonsContent.forEach((b) => {
      const btn = document.createElement("button");
      btn.classList.add(...b.classes);
      btn.innerHTML = b.text;

      if (b.disabled) {
        btn.disabled = b.disabled;
        btn.dataset.hasToggle = "true";
      }

      buttons.append(btn);
    });

    return buttons;
  }

  private static createSpeedControl() {
    const speedControl = document.createElement("div");
    speedControl.classList.add("speed-сontrol");

    const label = document.createElement("label");
    label.setAttribute("for", "speed");
    label.innerHTML = "Speed: ";

    const inputSpeed = document.createElement("input") as HTMLInputElement;
    inputSpeed.id = "speed";
    inputSpeed.type = "range";
    inputSpeed.step = "0.1";
    inputSpeed.value = "0";
    inputSpeed.max = "5";

    const output = document.createElement("output") as HTMLOutputElement;
    output.setAttribute("for", "speed");

    speedControl.append(label, inputSpeed, output);

    return speedControl;
  }

  private static createFieldSizeControls() {
    const fieldSizeControls = document.createElement("div");

    const labelInputWidth = document.createElement("label");
    labelInputWidth.innerHTML = "Width: ";

    const inputWidth = document.createElement("input");
    inputWidth.setAttribute("type", "number");
    inputWidth.classList.add("field-size", "field-size--width");

    const labelInputHeight = document.createElement("label");
    labelInputHeight.innerHTML = "Height: ";

    const inputHeight = document.createElement("input");
    inputHeight.setAttribute("type", "number");
    inputHeight.classList.add("field-size", "field-size--height");

    fieldSizeControls.append(
      labelInputWidth,
      inputWidth,
      labelInputHeight,
      inputHeight
    );

    return fieldSizeControls;
  }
}
