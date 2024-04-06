import { GamePadWatch } from "./gamepads/watch";
import { GameScreen } from "./screen";

const gamepadWatch = new GamePadWatch({
  onGamePadConnected: () => {
    screen.render();
  },
  onGamePadDisconnected: () => {
    screen.render();
  },
});

const screen = new GameScreen({
  width: 1600,
  height: 900,
  el: "#screen",
});

screen.connect(gamepadWatch);
