import { GamePad } from "../gamepads";
import { gameButtonIndexTarget } from "./const";

interface UserScreenOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  gamepad: GamePad;
  canvasNode: HTMLCanvasElement;
  scoreChange?: () => void;
}

export class UserScreen {
  x: number;
  y: number;
  width: number;
  height: number;
  gamepad: GamePad;
  canvasNode: HTMLCanvasElement;
  firstRender = true;
  isStop: boolean;
  task: number;
  score = 0;

  constructor(option: UserScreenOptions) {
    this.x = option.x;
    this.y = option.y;
    this.width = option.width;
    this.height = option.height;
    this.gamepad = option.gamepad;
    this.canvasNode = option.canvasNode;
    this.isStop = false;

    const renderButton = () => {
      if (this.isStop) return;
      const ctx = this.canvasNode.getContext("2d") as CanvasRenderingContext2D;
      ctx.clearRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "#f0f0f0";
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = "black";

      this.gamepad.enterButtons.forEach((button, index) => {
        const buttonX = this.x + 10;
        const buttonY = this.y + 10 + index * 30;
        const buttonWidth = 50;
        const buttonHeight = 20;

        const buttonText = gameButtonIndexTarget[button.index];

        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "24px serif";
        ctx.fillText(buttonText, buttonX + 100, buttonY + 20);
        if (button.pressed && this.task === button.index) {
          this.createTask();
          this.gamepad.vibrate(1, 200);
          this.score++;
          option.scoreChange?.();
        }
        ctx.fillStyle = button.pressed
          ? "red"
          : this.task === button.index
          ? "yellow"
          : "green";
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
        ctx.restore();
      });

      const leftStickX = this.x + 200;
      const leftStickY = this.y + 100;
      const leftStickR = 50;
      const leftStickPointR = 5;
      ctx.save();
      ctx.beginPath();
      ctx.arc(leftStickX, leftStickY, leftStickR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        leftStickX + this.gamepad.axes[0] * leftStickR,
        leftStickY + this.gamepad.axes[1] * leftStickR,
        leftStickPointR,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      const rightStickX = this.x + 500;
      const rightStickY = this.y + 100;
      const rightStickR = 50;
      const rightStickPointR = 5;
      ctx.save();
      ctx.beginPath();
      ctx.arc(rightStickX, rightStickY, rightStickR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(
        rightStickX + this.gamepad.axes[2] * rightStickR,
        rightStickY + this.gamepad.axes[3] * rightStickR,
        rightStickPointR,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = "black";
      ctx.font = "24px serif";
      ctx.fillText(`Score: ${this.score}`, leftStickX + 200, leftStickY + 100);
      //   ctx.fillText(
      //     `Axes[0]: ${this.gamepad.axes[0]}`,
      //     leftStickX + 200,
      //     leftStickY + 100
      //   );
      //   ctx.fillText(
      //     `Axes[1]: ${this.gamepad.axes[1]}`,
      //     leftStickX + 200,
      //     leftStickY + 130
      //   );
      //   ctx.fillText(
      //     `Axes[2]: ${this.gamepad.axes[2]}`,
      //     leftStickX + 200,
      //     leftStickY + 160
      //   );
      //   ctx.fillText(
      //     `Axes[3]: ${this.gamepad.axes[3]}`,
      //     leftStickX + 200,
      //     leftStickY + 190
      //   );

      requestAnimationFrame(renderButton);
    };

    requestAnimationFrame(renderButton);
    this.createTask();
  }

  createTask() {
    const task = Math.floor(Math.random() * 16);
    if (task === this.task) {
      this.createTask();
      return;
    }
    this.task = task;
  }

  clear() {
    const ctx = this.canvasNode.getContext("2d") as CanvasRenderingContext2D;
    ctx.clearRect(this.x, this.y, this.width, this.height);
    this.isStop = true;
  }
}
