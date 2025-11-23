import * as THREE from 'three';

export class Player {
  constructor(inputManager) {
    this.inputManager = inputManager;

    /* Pontos de Vida Maximo e Atual */
    this.maxHP = 100;
    this.currentHP = 100;
    this.updateHealthBar();


    this.config = {
      moveSpeed: 0.15,
      gravity: 0.012,
      jumpForce: 0.4,
      height: 3.0, 
      maxDistance: 150,
      collisionRadius: 1.5, 
    };

    this.barriers = []; 

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, this.config.height + 5, 20);

    this.velocity = new THREE.Vector3();
    this.yaw = 0;
    this.pitch = 0;
    this.canJump = false;
    this.isMoving = false;
    this.lastPosition = this.camera.position.clone();
    this.wasInAir = false; 
    this.onJump = null; 
    this.onLand = null; 

    this.inputManager.onMouseMove = (deltaX, deltaY) =>
      this.handleMouseMove(deltaX, deltaY);
    this.inputManager.onJump = () => this.jump();
  }

  update() {
    this.updateMovement();
    this.updateBoundaries();
    this.detectMovement();
  }

  detectMovement() {
    const distance = this.lastPosition.distanceTo(this.camera.position);
    this.isMoving = distance > 0.05; 
    this.lastPosition.copy(this.camera.position);
  }

  updateMovement() {
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();

    forward.set(Math.sin(this.yaw), 0, Math.cos(this.yaw)).multiplyScalar(-1);
    right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const currentVelocityY = this.velocity.y;
    this.velocity.set(0, currentVelocityY, 0);

    const moveInput = new THREE.Vector3();

    if (this.inputManager.isMovingForward())
      moveInput.add(forward);
    if (this.inputManager.isMovingBackward())
      moveInput.add(forward.clone().multiplyScalar(-1));
    if (this.inputManager.isMovingRight())
      moveInput.add(right);
    if (this.inputManager.isMovingLeft())
      moveInput.add(right.clone().multiplyScalar(-1));

    if (moveInput.length() > 0) {
      moveInput.normalize();
      this.velocity.add(moveInput.multiplyScalar(this.config.moveSpeed));
    }

    this.velocity.y -= this.config.gravity;

    const newPosition = this.camera.position.clone().add(this.velocity);

    if (newPosition.y < this.config.height) {
      newPosition.y = this.config.height;
      this.velocity.y = 0;

      if (this.wasInAir) {
        this.onLand?.(); 
        this.wasInAir = false;
      }

      this.canJump = true;
    } else {
      this.wasInAir = true; 
      this.canJump = false;
    }

    this.camera.position.copy(newPosition);
  }

  updateBoundaries() {
    if (this.barriers.length > 0) {
      this.checkBarrierCollision();
    }
  }

  checkBarrierCollision() {
    const pos = this.camera.position;
    const radius = this.config.collisionRadius;

    for (const barrier of this.barriers) {
      const bx = barrier.position.x;
      const bz = barrier.position.z;
      const bw = barrier.width / 2;
      const bd = barrier.depth / 2;

      if (
        pos.x + radius > bx - bw &&
        pos.x - radius < bx + bw &&
        pos.z + radius > bz - bd &&
        pos.z - radius < bz + bd
      ) {
        const dx = pos.x - bx;
        const dz = pos.z - bz;

        const closestX = Math.min(Math.abs(dx + bw), Math.abs(dx - bw));
        const closestZ = Math.min(Math.abs(dz + bd), Math.abs(dz - bd));

        if (closestX < closestZ) {
          pos.x = dx > 0 ? bx + bw + radius : bx - bw - radius;
        } else {
          pos.z = dz > 0 ? bz + bd + radius : bz - bd - radius;
        }
      }
    }
  }

  setBarriers(barriers) {
    this.barriers = barriers;
  }

  handleMouseMove(deltaX, deltaY) {
    this.yaw -= deltaX * this.inputManager.mouseSensitivity;
    this.pitch -= deltaY * this.inputManager.mouseSensitivity;

    this.pitch = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.pitch)
    );

    this.camera.rotation.order = 'YXZ';
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }

  jump() {
    if (this.canJump) {
      this.velocity.y = this.config.jumpForce;
      this.canJump = false;
      this.wasInAir = true; 
      this.onJump?.(); 
    }
  }

  setPosition(x, y, z) {
    this.camera.position.set(x, y, z);
  }

  getPosition() {
    return this.camera.position.clone();
  }

  getCamera() {
    return this.camera;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  /* Modificadoes dos Pontos de Vida */
updateHealthBar() {
  const bar = document.getElementById("barra-de-vida");
  if (!bar) return;
  const pct = (this.currentHP / this.maxHP) * 100;
  bar.style.width = pct + "%";
}

takeDamage(amount) {
  this.currentHP = Math.max(0, this.currentHP - amount); // vida atual vai de 0 ao valor da vida atual - dano
  this.updateHealthBar();
}

heal(amount) {
  this.currentHP = Math.min(this.maxHP, this.currentHP + amount);
  this.updateHealthBar();
}


}
