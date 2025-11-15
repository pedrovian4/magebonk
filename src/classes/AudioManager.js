/**
 * AudioManager - Gerencia áudio do jogo
 */
import * as THREE from 'three';

export class AudioManager {
  constructor(camera) {
    this.listener = new THREE.AudioListener();
    camera.add(this.listener);

    this.audioLoader = new THREE.AudioLoader();
    this.sounds = {};
    this.lastWalkTime = 0;
    this.walkInterval = 400; // ms entre passos
  }

  loadSound(name, path) {
    return new Promise((resolve) => {
      this.audioLoader.load(path, (audioBuffer) => {
        const sound = new THREE.Audio(this.listener);
        sound.setBuffer(audioBuffer);
        sound.setVolume(0.7);
        this.sounds[name] = sound;
        resolve(sound);
      });
    });
  }

  playWalkSound() {
    const now = Date.now();
    if (now - this.lastWalkTime < this.walkInterval) {
      return;
    }

    this.lastWalkTime = now;

    if (this.sounds.walk) {
      // Para o som anterior se ainda estiver tocando
      if (this.sounds.walk.isPlaying) {
        this.sounds.walk.stop();
      }

      // Toca um fragmento pequeno do áudio (150ms = 0.15s)
      this.sounds.walk.currentTime = 0;
      this.sounds.walk.play();

      // Para após 150ms
      setTimeout(() => {
        if (this.sounds.walk && this.sounds.walk.isPlaying) {
          this.sounds.walk.stop();
        }
      }, 150);
    }
  }

  playJumpFallSound() {
    if (this.sounds.jumpFall) {
      if (this.sounds.jumpFall.isPlaying) {
        this.sounds.jumpFall.stop();
      }

      // Toca um fragmento pequeno do áudio (200ms = 0.2s)
      this.sounds.jumpFall.currentTime = 0;
      this.sounds.jumpFall.play();

      // Para após 200ms
      setTimeout(() => {
        if (this.sounds.jumpFall && this.sounds.jumpFall.isPlaying) {
          this.sounds.jumpFall.stop();
        }
      }, 200);
    }
  }

  playSound(name) {
    if (this.sounds[name] && !this.sounds[name].isPlaying) {
      this.sounds[name].currentTime = 0;
      this.sounds[name].play();
    }
  }

  stopSound(name) {
    if (this.sounds[name]) {
      this.sounds[name].stop();
    }
  }
}
