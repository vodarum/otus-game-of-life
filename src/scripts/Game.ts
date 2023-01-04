import { IGameField } from "./GameField";
import { IGameView } from "./GameView";

export interface IGame {
  renderInitialState(): void;
}

export class Game implements IGame {
  private gameField: IGameField;

  private gameView: IGameView;

  private generatorId?: number;

  private isRunning = false;

  private speed: number;

  constructor(gameField: IGameField, gameView: IGameView, speed = 1) {
    this.gameField = gameField;
    this.gameView = gameView;
    this.speed = Game.toCorrectSpeed(speed);

    this.renderInitialState();
  }

  private static toCorrectSpeed(speed: number): number {
    if (speed <= 0) {
      console.log("Speed must be greater than 0");
      return 0.1;
    }

    if (speed > 5) {
      console.log("Speed should not be more than 5");
      return 5;
    }

    return speed;
  }

  renderInitialState() {
    const state = this.gameField.getState();

    this.gameView.updateGameField(state);
    this.gameView.updateGameState({
      width: state[0].length,
      height: state.length,
      speed: this.speed,
    });

    this.bindCallbacks();
  }

  private bindCallbacks() {
    this.gameView.onCellClick(this.toggleCell.bind(this));
    this.gameView.onNextBtnClick(this.next.bind(this));
    this.gameView.onRandomBtnClick(this.fillState.bind(this));
    this.gameView.onClearBtnClick(this.fillState.bind(this, 0));
    this.gameView.onFieldSizeChange(this.changeFieldSize.bind(this));
    this.gameView.onSpeedChange(this.changeSpeed.bind(this));
    this.gameView.onGameStateChange(this.toggleIsRunning.bind(this));
  }

  private toggleCell(x: number, y: number) {
    const state = this.gameField.getState();

    this.gameField.toggleCellState(x, y);
    this.gameView.updateGameField(state);
  }

  private changeFieldSize(width: number, height: number) {
    this.gameField.setSize(width, height);

    const state = this.gameField.getState();

    this.gameView.updateGameField(state);
    this.gameView.updateGameState({
      width: state[0].length,
      height: state.length,
    });
  }

  private changeSpeed(speed: number) {
    this.speed = speed;

    this.gameView.updateGameState({
      speed,
    });

    if (this.isRunning) {
      this.start();
    }
  }

  private next() {
    const isNextGeneration = this.gameField.nextGeneration();
    const state = this.gameField.getState();

    this.gameView.updateGameField(state);

    if (this.isRunning) {
      this.toggleIsRunning(isNextGeneration);
    }

    if (!isNextGeneration) {
      alert("Игра окончена!");
    }
  }

  private toggleIsRunning(isRunning: boolean) {
    /* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
    isRunning ? this.start() : this.stop();

    if (this.isRunning !== isRunning) {
      this.isRunning = isRunning;

      this.gameView.updateGameState({
        isRunning,
      });
    }
  }

  private start() {
    clearTimeout(this.generatorId);

    this.generatorId = window.setTimeout(() => {
      this.next();
    }, this.speed * 1000);
  }

  private stop() {
    clearTimeout(this.generatorId);
  }

  private fillState(cellValue?: 0 | 1) {
    this.gameField.fillState(cellValue);

    const state = this.gameField.getState();

    this.gameView.updateGameField(state);
  }
}
