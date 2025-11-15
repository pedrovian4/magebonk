import * as THREE from 'three';
import { grassShader } from './GrassShader.js';

export class GrassGenerator {
  constructor(options = {}) {
    this.options = {
      planeSize: 200,
      bladeCount: 15000,
      bladeWidth: 0.1,
      bladeHeight: 0.8,
      bladeHeightVariation: 0.6,
      ...options,
    };

    this.startTime = Date.now();
    this.mesh = null;
    this.playerPosition = new THREE.Vector3();
    this.walkRadius = 3;
    this.grassPositions = [];
  }

  generate() {
    const positions = [];
    const uvs = [];
    const indices = [];
    const colors = [];
    this.grassPositions = [];

    for (let i = 0; i < this.options.bladeCount; i++) {
      const vertexCount = 5;
      const surfaceMin = this.options.planeSize / 2 * -1;
      const surfaceMax = this.options.planeSize / 2;

      const x = Math.random() * (surfaceMax - surfaceMin) + surfaceMin;
      const z = Math.random() * (surfaceMax - surfaceMin) + surfaceMin;

      const pos = new THREE.Vector3(x, 0, z);
      this.grassPositions.push(pos.clone()); 

      const uv = [
        (x - surfaceMin) / (surfaceMax - surfaceMin),
        (z - surfaceMin) / (surfaceMax - surfaceMin),
      ];

      const blade = this.generateBlade(pos, i * vertexCount, uv);
      blade.verts.forEach((vert) => {
        positions.push(...vert.pos);
        uvs.push(...vert.uv);
        colors.push(...vert.color);
      });
      blade.indices.forEach((indice) => indices.push(indice));
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    geometry.setIndex(indices);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0.0 },
        playerPos: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: grassShader.vert,
      fragmentShader: grassShader.frag,
      vertexColors: true,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    return this.mesh;
  }

  generateBlade(center, vArrOffset, uv) {
    const { bladeWidth, bladeHeight, bladeHeightVariation } = this.options;
    const midWidth = bladeWidth * 0.5;
    const tipOffset = 0.1;
    const height = bladeHeight + Math.random() * bladeHeightVariation;

    const yaw = Math.random() * Math.PI * 2;
    const yawUnitVec = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));

    const tipBend = Math.random() * Math.PI * 2;
    const tipBendUnitVec = new THREE.Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend));

    const bl = new THREE.Vector3().addVectors(center, yawUnitVec.clone().multiplyScalar(bladeWidth / 2));
    const br = new THREE.Vector3().addVectors(center, yawUnitVec.clone().multiplyScalar(-bladeWidth / 2));
    const tl = new THREE.Vector3().addVectors(center, yawUnitVec.clone().multiplyScalar(midWidth / 2));
    const tr = new THREE.Vector3().addVectors(center, yawUnitVec.clone().multiplyScalar(-midWidth / 2));
    const tc = new THREE.Vector3().addVectors(center, tipBendUnitVec.clone().multiplyScalar(tipOffset));

    tl.y += height / 2;
    tr.y += height / 2;
    tc.y += height;

    const black = [0, 0, 0];
    const gray = [0.5, 0.5, 0.5];
    const white = [1.0, 1.0, 1.0];

    const verts = [
      { pos: bl.toArray(), uv: uv, color: black },
      { pos: br.toArray(), uv: uv, color: black },
      { pos: tr.toArray(), uv: uv, color: gray },
      { pos: tl.toArray(), uv: uv, color: gray },
      { pos: tc.toArray(), uv: uv, color: white },
    ];

    const indices = [
      vArrOffset, vArrOffset + 1, vArrOffset + 2,
      vArrOffset + 2, vArrOffset + 4, vArrOffset + 3,
      vArrOffset + 3, vArrOffset, vArrOffset + 2,
    ];

    return { verts, indices };
  }

  update(playerPosition = null) {
    if (this.mesh) {
      const elapsedTime = Date.now() - this.startTime;
      this.mesh.material.uniforms.iTime.value = elapsedTime;

      if (playerPosition) {
        this.playerPosition.copy(playerPosition);
        this.playerPosition.y = 0; 
        this.mesh.material.uniforms.playerPos.value.copy(this.playerPosition);
      }
    }
  }

  setPlayerPosition(position) {
    this.playerPosition.copy(position);
    this.playerPosition.y = 0;
    if (this.mesh) {
      this.mesh.material.uniforms.playerPos.value.copy(this.playerPosition);
    }
  }

  getMesh() {
    return this.mesh;
  }
}
