
const magosData = [
  {
    id: 1,
    nome: 'Arcano',
    icon: '🔵',
    descricao: 'Mago especializado em magia pura e controle elemental',
    stats: { poder: 95, defesa: 60, velocidade: 70 }
  },
  {
    id: 2,
    nome: 'Sombra',
    icon: '⚫',
    descricao: 'Misterioso e astuto, controla as trevas e ilusões',
    stats: { poder: 85, defesa: 50, velocidade: 90 }
  },
  {
    id: 3,
    nome: 'Chama',
    icon: '🔥',
    descricao: 'Destruidor de magia do fogo e calor abrasador',
    stats: { poder: 100, defesa: 55, velocidade: 75 }
  },
  {
    id: 4,
    nome: 'Gelo',
    icon: '❄️',
    descricao: 'Controlador de gelo e temperaturas extremas',
    stats: { poder: 80, defesa: 85, velocidade: 70 }
  },
  {
    id: 5,
    nome: 'Natureza',
    icon: '🌿',
    descricao: 'Conectado com a vida e poder regenerativo',
    stats: { poder: 75, defesa: 80, velocidade: 65 }
  },
  {
    id: 6,
    nome: 'Temporal',
    icon: '⚡',
    descricao: 'Manipulador do tempo e velocidade relativa',
    stats: { poder: 90, defesa: 65, velocidade: 95 }
  }
];

function createMagoCard(mago) {
  const card = document.createElement('div');
  card.className = 'mago-card';
  card.innerHTML = `
    <div class="mago-content">
      <div class="mago-icon">${mago.icon}</div>
      <h3>${mago.nome}</h3>
      <p>${mago.descricao}</p>
      <div class="mago-stats">
        <div class="stat">
          <span class="stat-label">Poder</span>
          ${mago.stats.poder}
        </div>
        <div class="stat">
          <span class="stat-label">Defesa</span>
          ${mago.stats.defesa}
        </div>
        <div class="stat">
          <span class="stat-label">Veloc.</span>
          ${mago.stats.velocidade}
        </div>
      </div>
    </div>
  `;

  card.addEventListener('click', () => {
    selectMago(mago);
  });

  return card;
}

function selectMago(mago) {
  console.log(`Mago selecionado: ${mago.nome}`);
  localStorage.setItem('selectedMago', JSON.stringify(mago));
  alert(`Você selecionou ${mago.nome}! 🎉`);
}

function init() {
  const grid = document.getElementById('magosGrid');
  magosData.forEach(mago => {
    grid.appendChild(createMagoCard(mago));
  });
  console.log('Página de magos carregada! ✦');
}

document.addEventListener('DOMContentLoaded', init);
