export class InputManager {
  constructor() {
    this.keys = {
      w: false,
      a: false,
      s: false,
      d: false,
      arrowUp: false,
      arrowDown: false,
      arrowLeft: false,
      arrowRight: false,
    };

    this.isPointerLocked = false;
    this.mouseSensitivity = 0.003;

    this.onMouseMove = null;
    this.onJump = null;
    this.onPointerLockChange = null;

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));

    document.addEventListener('click', () => {
      if (!this.isPointerLocked) {
        document.body.requestPointerLock =
          document.body.requestPointerLock ||
          document.body.mozRequestPointerLock;
        document.body.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === document.body;
      this.onPointerLockChange?.(this.isPointerLocked);
    });

    document.addEventListener('mozpointerlockchange', () => {
      this.isPointerLocked = document.mozPointerLockElement === document.body;
      this.onPointerLockChange?.(this.isPointerLocked);
    });
  }

  handleKeyDown(e) {
    const key = e.key.toLowerCase();

    if (key === 'w') this.keys.w = true;
    if (key === 'a') this.keys.a = true;
    if (key === 's') this.keys.s = true;
    if (key === 'd') this.keys.d = true;
    if (e.key === 'ArrowUp') this.keys.arrowUp = true;
    if (e.key === 'ArrowDown') this.keys.arrowDown = true;
    if (e.key === 'ArrowLeft') this.keys.arrowLeft = true;
    if (e.key === 'ArrowRight') this.keys.arrowRight = true;

    if (key === ' ') {
      e.preventDefault();
      this.onJump?.();
    }

    if (key === 'escape') {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
  }

  handleKeyUp(e) {
    const key = e.key.toLowerCase();

    if (key === 'w') this.keys.w = false;
    if (key === 'a') this.keys.a = false;
    if (key === 's') this.keys.s = false;
    if (key === 'd') this.keys.d = false;
    if (e.key === 'ArrowUp') this.keys.arrowUp = false;
    if (e.key === 'ArrowDown') this.keys.arrowDown = false;
    if (e.key === 'ArrowLeft') this.keys.arrowLeft = false;
    if (e.key === 'ArrowRight') this.keys.arrowRight = false;
  }

  handleMouseMove(e) {
    if (!this.isPointerLocked) return;
    this.onMouseMove?.(e.movementX, e.movementY);
  }

  isMovingForward() {
    return this.keys.w || this.keys.arrowUp;
  }

  isMovingBackward() {
    return this.keys.s || this.keys.arrowDown;
  }

  isMovingLeft() {
    return this.keys.a || this.keys.arrowLeft;
  }

  isMovingRight() {
    return this.keys.d || this.keys.arrowRight;
  }

  lockPointer() {
    if (!this.isPointerLocked) {
      document.body.requestPointerLock =
        document.body.requestPointerLock ||
        document.body.mozRequestPointerLock;
      document.body.requestPointerLock();
    }
  }

  unlockPointer() {
    if (this.isPointerLocked) {
      document.exitPointerLock();
    }
  }
}
