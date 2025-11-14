const settingsDefaults = {
  volumeGeral: 70,
  volumeMusica: 60,
  volumeEfeitos: 80,
  mouseSensitivity: 5,
  invertY: false,
  difficulty: 'normal',
  qualidade: 'media',
  shadows: true,
  bloom: true
};

function loadSettings() {
  const saved = localStorage.getItem('settings');
  return saved ? JSON.parse(saved) : settingsDefaults;
}

function saveSettings() {
  const settings = {
    volumeGeral: parseInt(document.getElementById('volumeGeral').value),
    volumeMusica: parseInt(document.getElementById('volumeMusica').value),
    volumeEfeitos: parseInt(document.getElementById('volumeEfeitos').value),
    mouseSensitivity: parseInt(document.getElementById('mouseSensitivity').value),
    invertY: document.getElementById('invertY').checked,
    difficulty: document.getElementById('difficulty').value,
    qualidade: document.getElementById('qualidade').value,
    shadows: document.getElementById('shadows').checked,
    bloom: document.getElementById('bloom').checked
  };

  localStorage.setItem('settings', JSON.stringify(settings));
  alert('Configurações salvas com sucesso! ✓');
  console.log('Configurações salvas:', settings);
}

function resetSettings() {
  if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
    localStorage.removeItem('settings');
    initSettings();
    alert('Configurações restauradas! ⟲');
  }
}

function updateRangeDisplay(inputId, displayId) {
  const input = document.getElementById(inputId);
  const display = document.getElementById(displayId);

  input.addEventListener('input', (e) => {
    display.textContent = inputId.includes('Sensitivity')
      ? e.target.value
      : e.target.value + '%';
  });
}

function initSettings() {
  const settings = loadSettings();

  document.getElementById('volumeGeral').value = settings.volumeGeral;
  document.getElementById('volumeGeralValue').textContent = settings.volumeGeral + '%';

  document.getElementById('volumeMusica').value = settings.volumeMusica;
  document.getElementById('volumeMusicaValue').textContent = settings.volumeMusica + '%';

  document.getElementById('volumeEfeitos').value = settings.volumeEfeitos;
  document.getElementById('volumeEfeitosValue').textContent = settings.volumeEfeitos + '%';

  document.getElementById('mouseSensitivity').value = settings.mouseSensitivity;
  document.getElementById('mouseSensitivityValue').textContent = settings.mouseSensitivity;

  document.getElementById('invertY').checked = settings.invertY;
  document.getElementById('difficulty').value = settings.difficulty;
  document.getElementById('qualidade').value = settings.qualidade;
  document.getElementById('shadows').checked = settings.shadows;
  document.getElementById('bloom').checked = settings.bloom;

  // Setup range displays
  updateRangeDisplay('volumeGeral', 'volumeGeralValue');
  updateRangeDisplay('volumeMusica', 'volumeMusicaValue');
  updateRangeDisplay('volumeEfeitos', 'volumeEfeitosValue');
  updateRangeDisplay('mouseSensitivity', 'mouseSensitivityValue');

  console.log('Configurações carregadas! ⚙');
}

window.saveSettings = saveSettings;
window.resetSettings = resetSettings;

document.addEventListener('DOMContentLoaded', initSettings);
