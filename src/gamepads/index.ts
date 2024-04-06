export class GamePad {
  gamepad: Gamepad;
  enterButtons: { value: number; pressed: boolean; index: number }[];
  axes: readonly number[];

  constructor(gamepad) {
    this.gamepad = gamepad;

    const pollGamepads = () => {
      const gamepads = navigator.getGamepads();
      if (gamepads && this.gamepad) {
        const gamepad = gamepads[this.gamepad.index];
        this.enterButtons =
          gamepad?.buttons.map((button, index) => ({
            value: button.value,
            pressed: button.pressed,
            index,
          })) || [];
        this.axes = gamepad?.axes || [];
      }
      requestAnimationFrame(pollGamepads);
    };

    requestAnimationFrame(pollGamepads);
  }

  vibrate(value: number, duration: number) {
    const gamepads = navigator.getGamepads();
    if (gamepads && this.gamepad) {
      const gamepad = gamepads[this.gamepad.index];
      gamepad?.vibrationActuator?.playEffect("dual-rumble", {
        duration,
        strongMagnitude: value,
        weakMagnitude: value,
      });
    }
  }
}
