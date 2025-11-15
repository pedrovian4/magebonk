import * as THREE from 'three';
import { InputManager } from './InputManager.js';
import { Player } from './Player.js';
import { GameScene } from './GameScene.js';
import { AudioManager } from './AudioManager.js';
import { FPSCounter } from './FPSCounter.js';

export class Game {
  constructor() {
    this.inputManager = new InputManager();
    this.gameScene = new GameScene();
    this.player = new Player(this.inputManager);
    this.audioManager = new AudioManager(this.player.getCamera());
    this.fpsCounter = new FPSCounter(); 

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    const container = document.getElementById('canvas-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }

    this.setupEventListeners();
    this.setupAudio();
    this.setupCollisions();
    this.setupPlayerAudio();

    this.animate();
  }

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());
  }

  async setupAudio() {
    try {
      await this.audioManager.loadSound('walk', '/sounds/walking-on-grass.mp3');
      await this.audioManager.loadSound('jumpFall', '/sounds/jump-fall.mp3');
    } catch (error) {
      console.warn('Erro ao carregar sons:', error);
    }
  }

  setupCollisions() {
    const barriers = this.gameScene.getBarriers();
    this.player.setBarriers(barriers);
  }

  setupPlayerAudio() {
    this.player.onLand = () => {
      this.audioManager.playJumpFallSound();
    };
  }

  onWindowResize() {
    this.player.onWindowResize();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    this.player.update();
    const playerPos = this.player.getPosition();
    this.gameScene.update(playerPos);

    if (this.player.isMoving && this.player.canJump) {
      this.audioManager.playWalkSound();
    }
  }

  render() {
    this.renderer.render(
      this.gameScene.getScene(),
      this.player.getCamera()
    );
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.update();
    this.render();
    this.fpsCounter.update(); 
  };

  dispose() {
    this.gameScene.dispose();
    this.renderer.dispose();
    this.fpsCounter.dispose();
  }
}
