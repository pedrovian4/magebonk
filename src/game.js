
/**
 * MageBonk - Jogo Principal
 * Arquivo de entrada para a cena do jogo com movimentação FPS
 * Usando arquitetura orientada a objetos
 */

import { Game } from './classes/Game.js';

let game;

function init() {
  game = new Game();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Cleanup ao descarregar a página
window.addEventListener('beforeunload', () => {
  game?.dispose();
});
