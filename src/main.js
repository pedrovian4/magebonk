const menuButtons = document.querySelectorAll('.menu-button');

menuButtons.forEach(button => {
  button.addEventListener('click', function() {
    const action = this.getAttribute('onclick');
    console.log(`Botão clicado: ${action}`);
  });
});

export function startGame() {
  console.log('Iniciando o jogo...');
}

export function selectMago() {
  console.log('Abrindo seleção de mago...');
}

export function openSettings() {
  console.log('Abrindo configurações...');
}
