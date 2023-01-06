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
  onBtnNextClick(cb: () => void): void;
  onBtnRandomClick(cb: () => void): void;
  onBtnClearClick(cb: () => void): void;
  onGameStateChange(cb: (newState: boolean) => void): void;
  onSpeedChange(cb: (speed: number) => void): void;
  onFieldSizeChange(cb: (width: number, height: number) => void): void;
}

export class GameView implements IGameView {
  wrapper: HTMLElement;

  constructor(el: HTMLElement) {
    this.wrapper = el;

    this.init();
  }

  private init() {
    const gameTitle = GameView.createGameTitle();
    const gameField = GameView.createGameField();
    const gameControls = GameView.createGameControls();

    this.wrapper.classList.add("game");
    this.wrapper.append(gameTitle, gameField, gameControls);
  }

  updateGameField(field: Cell[][]) {
    const width: number = field[0].length;
    const height: number = field.length;

    const gameField = this.wrapper.querySelector(
      ".game__field > table"
    ) as HTMLElement;
    const newGameField = gameField;
    newGameField.innerHTML = "";

    let allCellsAreDead = true;

    for (let y = 0; y < height; y++) {
      const row = document.createElement("tr");

      for (let x = 0; x < width; x++) {
        const cell = document.createElement("td");
        cell.classList.add("cell");
        cell.classList.add(field[y][x] ? "cell_alive" : "cell_dead");

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
    const buttons = this.wrapper.querySelectorAll(
      ".buttons__item"
    ) as NodeListOf<HTMLButtonElement>;

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
      this.updateControlsFieldSize(state.width, state.height);
    }

    if (typeof state.speed !== "undefined") {
      this.updateControlsSpeed(state.speed);
    }

    if (typeof state.isRunning !== "undefined") {
      this.updateBtnRun(state.isRunning);
    }
  }

  private updateControlsFieldSize(width: number, height: number) {
    const inputWidth = this.wrapper.querySelector(
      "#inputWidth"
    ) as HTMLInputElement;
    const inputHeight = this.wrapper.querySelector(
      "#inputHeight"
    ) as HTMLInputElement;

    inputWidth.value = `${width}`;
    inputHeight.value = `${height}`;
  }

  private updateControlsSpeed(speed: number) {
    const inputSpeed = this.wrapper.querySelector(
      "#inputSpeed"
    ) as HTMLInputElement;
    const outputSpeed = this.wrapper.querySelector(
      ".speed__output"
    ) as HTMLOutputElement;

    inputSpeed.value = speed.toFixed(1);
    outputSpeed.innerHTML = `${speed.toFixed(1)} s`;
  }

  private updateBtnRun(isRunning: boolean) {
    const btnRun = this.wrapper.querySelector("#btnRun") as HTMLButtonElement;

    if (isRunning) {
      btnRun.classList.remove("btn-run_play");
      btnRun.classList.add("btn-run_stop");

      btnRun.innerHTML = "Stop";
    } else {
      btnRun.classList.remove("btn-run_stop");
      btnRun.classList.add("btn-run_play");

      btnRun.innerHTML = "Play";
    }
  }

  onCellClick(cb: (x: number, y: number) => void) {
    const gameField = this.wrapper.querySelector(
      ".game__field > table"
    ) as HTMLElement;

    gameField.addEventListener("click", (e) => {
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
    const button = this.wrapper.querySelector("#btnRun") as HTMLButtonElement;

    button.addEventListener("click", () => {
      cb(button.innerHTML === "Play");
    });
  }

  onBtnNextClick(cb: () => void) {
    this.onBtnClick("#btnNext", cb);
  }

  onBtnRandomClick(cb: () => void) {
    this.onBtnClick("#btnRandom", cb);
  }

  onBtnClearClick(cb: () => void) {
    this.onBtnClick("#btnClear", cb);
  }

  private onBtnClick(selector: string, cb: () => void) {
    const button = this.wrapper.querySelector(selector) as HTMLButtonElement;

    button.addEventListener("click", () => {
      cb();
    });
  }

  onSpeedChange(cb: (speed: number) => void) {
    const inputSpeed = this.wrapper.querySelector(
      "#inputSpeed"
    ) as HTMLInputElement;

    inputSpeed.addEventListener("input", () => {
      cb(+inputSpeed.value);
    });
  }

  onFieldSizeChange(cb: (width: number, height: number) => void) {
    const inputWidth = this.wrapper.querySelector(
      "#inputWidth"
    ) as HTMLInputElement;
    const inputHeight = this.wrapper.querySelector(
      "#inputHeight"
    ) as HTMLInputElement;

    inputWidth.addEventListener("change", () => {
      cb(+inputWidth.value, +inputHeight.value);
    });

    inputHeight.addEventListener("change", () => {
      cb(+inputWidth.value, +inputHeight.value);
    });
  }

  private static createGameTitle() {
    const gameTitle = document.createElement("h1");
    gameTitle.classList.add("game__title");
    gameTitle.innerHTML = "OTUS Game of Life";

    return gameTitle;
  }

  private static createGameField() {
    const gameField = document.createElement("div");
    gameField.classList.add("game__field");

    const table = document.createElement("table");

    gameField.append(table);

    return gameField;
  }

  private static createGameControls() {
    const gameControls = document.createElement("div");
    gameControls.classList.add("game__controls", "controls");

    const controlsButtons = GameView.createControlsButtons();
    const controlsFieldSize = GameView.createControlsFieldSize();
    const controlsSpeed = GameView.createControlsSpeed();

    gameControls.append(controlsButtons, controlsFieldSize, controlsSpeed);

    return gameControls;
  }

  private static createControlsButtons() {
    const buttons = document.createElement("div");
    buttons.classList.add("controls__item", "buttons");

    const buttonsContent = [
      {
        id: "btnRun",
        classes: ["buttons__item", "btn-run", "btn-run_play"],
        text: "Play",
        disabled: true,
      },
      {
        id: "btnNext",
        classes: ["buttons__item", "btn-next"],
        text: "Next",
        disabled: true,
      },
      {
        id: "btnRandom",
        classes: ["buttons__item", "btn-random"],
        text: "Random",
      },
      {
        id: "btnClear",
        classes: ["buttons__item", "btn-clear"],
        text: "Clear",
        disabled: true,
      },
    ];

    buttonsContent.forEach((b) => {
      const btn = document.createElement("button");
      btn.id = b.id;
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

  private static createControlsSpeed() {
    const controlsSpeed = document.createElement("div");
    controlsSpeed.classList.add("controls__item", "speed");

    const label = document.createElement("label");
    label.classList.add("speed__label");
    label.setAttribute("for", "inputSpeed");
    label.innerHTML = "Speed: ";

    const inputSpeed = document.createElement("input") as HTMLInputElement;
    inputSpeed.classList.add("speed__input");
    inputSpeed.id = "inputSpeed";
    inputSpeed.type = "range";
    inputSpeed.step = "0.1";
    inputSpeed.value = "0";
    inputSpeed.max = "5";

    const output = document.createElement("output") as HTMLOutputElement;
    output.classList.add("speed__output");
    output.setAttribute("for", "inputSpeed");

    controlsSpeed.append(label, inputSpeed, output);

    return controlsSpeed;
  }

  private static createControlsFieldSize() {
    const controlsFieldSize = document.createElement("div");
    controlsFieldSize.classList.add("controls__item", "field-size");

    ["Width", "Height"].forEach((param) => {
      const fieldSizeParam = document.createElement("div");
      fieldSizeParam.classList.add("field-size__param");

      const label = document.createElement("label");
      label.classList.add("field-size__label");
      label.innerHTML = `${param}: `;

      const input = document.createElement("input");
      input.type = "number";
      input.id = `input${param}`;
      input.classList.add(
        "field-size__input",
        `field-size__input_${param.toLowerCase()}`
      );

      fieldSizeParam.append(label, input);
      controlsFieldSize.append(fieldSizeParam);
    });

    return controlsFieldSize;
  }
}
