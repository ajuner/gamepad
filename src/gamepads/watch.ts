import { GamePad } from ".";

export interface GamePadWatchOptions {
  onGamePadConnected: (gamepad: GamePad[]) => void;
  onGamePadDisconnected: (gamepad: GamePad[]) => void;
}

export class GamePadWatch {
  gamePads: GamePad[] = [];

  constructor(options: GamePadWatchOptions) {
    const { onGamePadConnected, onGamePadDisconnected } = options;

    window.addEventListener("gamepadconnected", (e: GamepadEvent) => {
      this.gamePads.push(new GamePad(e.gamepad));
      onGamePadConnected(this.gamePads);
    });

    window.addEventListener("gamepaddisconnected", (e: GamepadEvent) => {
      this.gamePads = this.gamePads.filter(
        (item) => item.gamepad.index !== e.gamepad.index
      );
      onGamePadDisconnected(this.gamePads);
    });
  }
}
