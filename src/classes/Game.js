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

    this.isPaused = false; 
    this.animationFrameId = null;

    // Nova referência ao menu de configurações
    this.settingsMenu = document.getElementById('settings-container'); 
    if (!this.settingsMenu) {
        console.error("O 'settings-container' elemenento não foi encontrado no DOM.");
    }
    
    // Adiciona o canvas do renderer ao container apropriado
    const container = document.getElementById('canvas-container');
    if (container) {
      container.appendChild(this.renderer.domElement);
    }

    // Verifica se o jogo deve iniciar com o menu aberto
    const params = new URLSearchParams(window.location.search);
    if (params.get('startMenu') === 'true') {
        // Inicializa o jogo despausado (isPaused = false), mas chama o togglePause
        // que irá pausar o jogo e abrir o menu.
        this.togglePause(); 
    }

    this.setupEventListeners();
    this.setupAudio();
    this.setupCollisions();
    this.setupPlayerAudio();
    this.animate();
  }

togglePause() {
    // alterna o estado de pausa 
    this.isPaused = !this.isPaused; 

    if (this.isPaused) {
        // Ações de pausa
        if (this.settingsMenu) {
            this.settingsMenu.style.display = 'block';
        }
        
        // Para o loop do jogo
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null; // limpa o ID após cancelar
        }
               
    } else {
        // Restauração após pausa
        if (this.settingsMenu) {
            this.settingsMenu.style.display = 'none';
        }
        
        // Reinicia o loop do jogo
        this.animate();       
    }
}

  setupEventListeners() {
    window.addEventListener('resize', () => this.onWindowResize());
  
    // Event listener para a tecla "P" para pausar/despausar o jogo
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() === "p") {
            this.togglePause();
        }
    });
    // Event Listener para perda de foco (mudança de aba ou minimização)
    document.addEventListener('visibilitychange', () => this.handleFocusChange());
    
    //Event Listener para o clique fora da janela do navegador (opcional, use blur/focus)
    window.addEventListener('blur', () => this.handleBlur());
    window.addEventListener('focus', () => this.handleFocus());
  } 

handleFocusChange() {
    if (document.hidden) {
        // Se a página não está visível, pausamos.
        // O togglePause() só pausará se já não estiver pausado.
        if (!this.isPaused) { 
            this.togglePause();
        }
    } else {
        // Se a página voltou a ficar visível, despausamos.
        // O togglePause() só despausará se estiver pausado.
        if (this.isPaused) {
            this.togglePause();
        }
    }
}

handleBlur() {
    // Perdeu o foco do navegador
    if (!this.isPaused) {
        this.togglePause();
    }
}

handleFocus() {
    if (this.isPaused) {
      this.togglePause(); 
    }
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
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    //Lógica para somente atualizar e renderizar quando não estiver pausado
    if (!this.isPaused) { 
        this.update();
        this.render();
        this.fpsCounter.update();
    } 
  };

  dispose() {
    this.gameScene.dispose();
    this.renderer.dispose();
    this.fpsCounter.dispose();
  }
}
