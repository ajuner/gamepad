import { GamePadWatch } from "../gamepads/watch";
import { UserScreen } from "./userScreen";

interface GameScreenOptions {
  width: number;
  height: number;
  el: string;
}

export class GameScreen {
  gamepadWatch: GamePadWatch;
  node: HTMLCanvasElement;
  userScreens: UserScreen[] = [];

  constructor(options: GameScreenOptions) {
    const { width, height, el } = options;

    const node = document.querySelector(el);
    if (node === null) {
      console.error("Element not found:", el);
    } else {
      this.node = node as HTMLCanvasElement;
      this.node.width = width;
      this.node.height = height;
    }

    this.render();
  }

  scoreChange() {
    // 记录两位玩家分数，如果差值大于 10 分，结束游戏
    console.log("scoreChange", this.userScreens);
    if (this.userScreens?.length === 2) {
      const [userScreen1, userScreen2] = this.userScreens;
      console.log(userScreen1.score, userScreen2.score);
      if (userScreen1.score - userScreen2.score > 10) {
        alert("Player 1 win");
        this.render();
      }

      if (userScreen2.score - userScreen1.score > 10) {
        alert("Player 2 win");
        this.render();
      }
    }
  }

  render() {
    const ctx = this.node.getContext("2d");
    this.userScreens.forEach((userScreen) => {
      userScreen.clear();
    });
    if (ctx) {
      ctx.clearRect(0, 0, this.node.width, this.node.height);
    }
    if (this.gamepadWatch?.gamePads?.length > 0) {
      if (this.gamepadWatch.gamePads.length === 1) {
        this.userScreens = [
          new UserScreen({
            x: 0,
            y: 0,
            width: this.node.width,
            height: this.node.height,
            gamepad: this.gamepadWatch.gamePads[0],
            canvasNode: this.node,
          }),
        ];
      }

      if (this.gamepadWatch.gamePads.length === 2) {
        const ctx = this.node.getContext("2d");
        const lineWidth = 2;
        if (ctx) {
          ctx.beginPath();
          ctx.strokeStyle = "black";
          ctx.lineWidth = lineWidth;
          ctx.moveTo(this.node.width / 2, 0);
          ctx.lineTo(this.node.width / 2, this.node.height);
          ctx.stroke();
        }
        this.userScreens = [
          new UserScreen({
            x: 0,
            y: 0,
            width: this.node.width / 2,
            height: this.node.height,
            gamepad: this.gamepadWatch.gamePads[0],
            canvasNode: this.node,
            scoreChange: this.scoreChange.bind(this),
          }),
          new UserScreen({
            x: this.node.width / 2 + lineWidth,
            y: 0,
            width: this.node.width / 2 - lineWidth,
            height: this.node.height,
            gamepad: this.gamepadWatch.gamePads[1],
            canvasNode: this.node,
            scoreChange: this.scoreChange.bind(this),
          }),
        ];
      }
    } else {
      console.log("Connect gamepad to start game");
      const ctx = this.node.getContext("2d");
      if (ctx) {
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "Connect gamepad to start game",
          this.node.width / 2,
          this.node.height / 2
        );
      }
    }
  }

  connect(watch: GamePadWatch) {
    this.gamepadWatch = watch;
  }
}
