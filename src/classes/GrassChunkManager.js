/**
 * GrassChunkManager: Trava o PC, não usar, tem que otimizar antes
 */
import * as THREE from 'three';
import { GrassGenerator } from './GrassGenerator.js';

export class GrassChunkManager {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.options = {
      chunkSize: 50,
      loadRadius: 3,
      bladeCount: 50000, 
      ...options,
    };

    this.chunks = new Map(); 
    this.playerChunkCoord = { x: 0, z: 0 };
    this.playerPosition = new THREE.Vector3();
    this.grassGenerators = []; 
  }

  update(playerPosition) {
    this.playerPosition.copy(playerPosition);

    const chunkX = Math.floor(playerPosition.x / this.options.chunkSize);
    const chunkZ = Math.floor(playerPosition.z / this.options.chunkSize);

    if (chunkX !== this.playerChunkCoord.x || chunkZ !== this.playerChunkCoord.z) {
      this.playerChunkCoord.x = chunkX;
      this.playerChunkCoord.z = chunkZ;
      this.updateVisibleChunks();
    }

    for (const generator of this.grassGenerators) {
      generator.setPlayerPosition(playerPosition);
      generator.update();
    }
  }

  updateVisibleChunks() {
    const { x: cx, z: cz } = this.playerChunkCoord;
    const { loadRadius, chunkSize } = this.options;

    const visibleCoords = new Set();

    for (let x = cx - loadRadius; x <= cx + loadRadius; x++) {
      for (let z = cz - loadRadius; z <= cz + loadRadius; z++) {
        const key = `${x},${z}`;
        visibleCoords.add(key);

        if (!this.chunks.has(key)) {
          this.createChunk(x, z);
        }
      }
    }

    for (const key of this.chunks.keys()) {
      if (!visibleCoords.has(key)) {
        this.removeChunk(key);
      }
    }
  }

  createChunk(chunkX, chunkZ) {
    const key = `${chunkX},${chunkZ}`;
    const { chunkSize, bladeCount } = this.options;

    const offsetX = chunkX * chunkSize;
    const offsetZ = chunkZ * chunkSize;

    const generator = new GrassGenerator({
      planeSize: chunkSize,
      bladeCount: bladeCount,
      bladeWidth: 0.08,
      bladeHeight: 0.3,
      bladeHeightVariation: 0.15,
    });

    const mesh = generator.generate();
    mesh.position.set(offsetX, 0, offsetZ);
    mesh.matrixAutoUpdate = false; 
    mesh.updateMatrix();
    this.scene.add(mesh);

    this.chunks.set(key, {
      generator,
      mesh,
      x: chunkX,
      z: chunkZ,
    });

    this.grassGenerators.push(generator);
  }

  removeChunk(key) {
    const chunk = this.chunks.get(key);
    if (chunk) {
      this.scene.remove(chunk.mesh);
      chunk.mesh.geometry.dispose();
      chunk.mesh.material.dispose();
      this.grassGenerators = this.grassGenerators.filter(
        (g) => g !== chunk.generator
      );
      this.chunks.delete(key);
    }
  }

  dispose() {
    for (const chunk of this.chunks.values()) {
      this.scene.remove(chunk.mesh);
      chunk.mesh.geometry.dispose();
      chunk.mesh.material.dispose();
    }
    this.chunks.clear();
    this.grassGenerators = [];
  }

  getStats() {
    return {
      activeChunks: this.chunks.size,
      totalGrassBlades: this.chunks.size * this.options.bladeCount,
      playerChunk: this.playerChunkCoord,
    };
  }
}
