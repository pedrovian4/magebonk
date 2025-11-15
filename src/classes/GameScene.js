import * as THREE from 'three';
import { GrassGenerator } from './GrassGenerator.js';

export class GameScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 500, 1000);

    this.grassGenerator = null;
    this.mapSize = 100;
    this.barriers = [];

    this.setupLighting();
    this.setupGround();
    this.setupBarriers();
    this.setupClouds();
  }

  clouds = []; 

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    this.scene.add(directionalLight);
  }

  setupGround() {
    const groundGeometry = new THREE.PlaneGeometry(this.mapSize, this.mapSize);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a5d34,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    this.grassGenerator = new GrassGenerator({
      planeSize: this.mapSize,
      bladeCount: 500000,
      bladeWidth: 0.2,
      bladeHeight: 0.2,
      bladeHeightVariation: 0.5,
    });
    const grassMesh = this.grassGenerator.generate();
    this.scene.add(grassMesh);
  }

  // TODO: Remover barreiras e adicionar geração procedural baseada em tile
  setupBarriers() {
    const size = this.mapSize / 2;
    const barrierHeight = 10;
    const barrierThickness = 2;

    // Barreira Norte (topo) - com sobra para fechar as quinas
    this.createBarrier(0, size, this.mapSize + barrierThickness * 2, barrierThickness, barrierHeight);
    // Barreira Sul (fundo) - com sobra para fechar as quinas
    this.createBarrier(0, -size, this.mapSize + barrierThickness * 2, barrierThickness, barrierHeight);
    // Barreira Leste (direita)
    this.createBarrier(size, 0, barrierThickness, this.mapSize, barrierHeight);
    // Barreira Oeste (esquerda)
    this.createBarrier(-size, 0, barrierThickness, this.mapSize, barrierHeight);
  }

  

  createBarrier(x, z, width, depth, height) {
    if (height === undefined) {
      height = depth;
      depth = 1;
    }

    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0000, 
      roughness: 0.8,
    });
    const barrier = new THREE.Mesh(geometry, material);
    barrier.position.set(x, height / 2, z);
    barrier.castShadow = true;
    barrier.receiveShadow = true;

    this.scene.add(barrier);
    this.barriers.push({
      position: barrier.position.clone(),
      width: width,
      height: height,
      depth: depth,
    });
  }

  setupClouds() {
    const skyGeometry = new THREE.SphereGeometry(500, 32, 32);
    const skyMaterial = new THREE.MeshBasicMaterial({
      color: 0x87ceeb,
      side: THREE.BackSide,
    });
    const sky = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(sky);

    const cloudCount = 8;
    for (let i = 0; i < cloudCount; i++) {
      const cloud = this.createCloud();
      cloud.position.set(
        Math.random() * 400 - 200,
        100 + Math.random() * 50,
        Math.random() * 400 - 200
      );
      this.clouds.push({
        mesh: cloud,
        speed: 10 + Math.random() * 20,
        distance: Math.random()*20,
      });
    }
  }

  createCloud() {
    const cloudGroup = new THREE.Group();
    const cloudMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.9,
      metalness: 0,
    });

    const cloudParts = 3;
    for (let i = 0; i < cloudParts; i++) {
      const geometry = new THREE.SphereGeometry(24 + i * 2, 24, 12);
      const mesh = new THREE.Mesh(geometry, cloudMaterial);
      mesh.position.x = (i - 1) * 8;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      cloudGroup.add(mesh);
    }

    this.scene.add(cloudGroup);
    return cloudGroup;
  }

  updateClouds(deltaTime = 0.016) {
    for (const cloudData of this.clouds) {
      cloudData.distance += cloudData.speed * deltaTime;

      const angle = cloudData.distance / 100;
      cloudData.mesh.position.x = Math.cos(angle) * 200;
      cloudData.mesh.position.z = Math.sin(angle) * 200;

      if (cloudData.distance > 628) {
        cloudData.distance = 0;
      }
    }
  }

  getScene() {
    return this.scene;
  }

  addObject(object) {
    this.scene.add(object);
  }

  removeObject(object) {
    this.scene.remove(object);
  }

  update(playerPosition = null) {
    if (this.grassGenerator && playerPosition) {
      this.grassGenerator.setPlayerPosition(playerPosition);
      this.grassGenerator.update();
    }

    this.updateClouds();
  }

  getBarriers() {
    return this.barriers;
  }

  dispose() {
  }
}
