export class FPSCounter {
  constructor() {
    this.frames = 0;
    this.fps = 0;
    this.lastTime = performance.now();
    this.element = null;

    if (import.meta.env.DEV) {
      this.createDisplay();
    }
  }

  createDisplay() {
    this.element = document.createElement('div');
    this.element.id = 'fps-counter';
    this.element.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #00ff00;
      padding: 10px 15px;
      font-family: monospace;
      font-size: 14px;
      border-radius: 5px;
      z-index: 999;
      border: 1px solid #00ff00;
      user-select: none;
      pointer-events: none;
    `;
    this.element.textContent = 'FPS: 0';
    document.body.appendChild(this.element);
  }

  update() {
    this.frames++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frames * 1000) / deltaTime);
      this.frames = 0;
      this.lastTime = currentTime;

      if (this.element) {
        this.element.textContent = `FPS: ${this.fps}`;

        if (this.fps >= 60) {
          this.element.style.color = '#00ff00'; 
        } else if (this.fps >= 30) {
          this.element.style.color = '#ffff00';
        } else {
          this.element.style.color = '#ff0000';
        }
      }
    }
  }

  dispose() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
