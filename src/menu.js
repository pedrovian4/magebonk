function generateParticles() {
  const particleCount = 30;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animation = `floating ${10 + Math.random() * 15}s infinite linear`;
    particle.style.animationDelay = Math.random() * 10 + 's';
    document.body.appendChild(particle);
  }
}

function setupButtonHovers() {
  const buttons = document.querySelectorAll('.menu-button');
  buttons.forEach(button => {
    button.addEventListener('click', (e) => {
      console.log(`Navegando para: ${button.getAttribute('href')}`);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  generateParticles();
  setupButtonHovers();
  console.log('Menu carregado! ⚔');
});
