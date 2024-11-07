import CollisionChecker from "./collisions.js";
// Importaciones desde bullets.js
import {
  createABullet,
  createMissile,
  createDeathStarBullet,
  createEnemyBullet,
} from "./bullets.js";

let player = document.getElementById("player");
let score = document.getElementById("score");
let startBtn = document.getElementById("startButton");
let gameContainer = document.getElementById("gameContainer");
let spawnTime = 4000;
let deathStarSpawnTime = 10000;
export let deathStarBulletSpeed = 5;
export let enemyBulletSpeed = 4;
let isDead = false;
let lifes = 5;
let damageCooldown = false; // Variable para evitar llamadas simultáneas

score.innerHTML = 0;

setInterval(() => {
  CollisionChecker.checkBulletCollisionWithEnemies();
  CollisionChecker.checkBulletCollisionWithDeathStar();
  CollisionChecker.checkPlayerCollisionWithEnemies();
  CollisionChecker.checkEnemyBulletCollisionWithPlayer();
  CollisionChecker.checkDeathStarBulletCollisionWithPlayer();
  CollisionChecker.checkMissileCollisionWithEnemies();
  CollisionChecker.checkMissileCollisionWithDeathStar();
}, 16);

document.addEventListener("keydown", movePlayer);
startBtn.addEventListener("click", start);
startBtn.addEventListener("click", hideStartButton);
document.addEventListener("keydown", shoot);

export function resetGame() {
  isDead = false;
  lifes = 5; // Reiniciar vidas a 5
  createLife(lifes);
  let enemies = document.querySelectorAll(".enemy");
  enemies.forEach((enemy) => enemy.remove());
  score.innerHTML = 0;
}

export function movePlayer(e) {
  let playerTop = parseInt(
    window.getComputedStyle(player).getPropertyValue("top")
  );
  let playerLeft = parseInt(
    window.getComputedStyle(player).getPropertyValue("left")
  );

  if (e.key === "ArrowUp" && playerTop > 0) {
    player.style.top = playerTop - 10 + "px";
  } else if (e.key === "ArrowDown" && playerTop < 750) {
    player.style.top = playerTop + 10 + "px";
  } else if (e.key === "ArrowLeft" && playerLeft > 0) {
    player.style.left = playerLeft - 10 + "px";
  } else if (e.key === "ArrowRight" && playerLeft < 500) {
    player.style.left = playerLeft + 10 + "px";
  }
}

export function moveEnemy(enemy, enemySpeed) {
  enemy.style.animation = `moveEnemy ${enemySpeed}s linear`;
}

export function setIsDead(value) {
  if (value !== true && value !== false) {
    return;
  }
  isDead = value;
}

export function increaseScore(value) {
  if (value === "increase") {
    let currentScore = parseInt(score.innerHTML);
    score.innerHTML = currentScore + 1;
  }
  return score.innerHTML;
}
export function start() {
  resetGame();
  startAudio();
  setInterval(() => {
    createEnemy();
  }, spawnTime);
  setInterval(() => {
    createDeathStar();
  }, deathStarSpawnTime);
}

export function createEnemy() {
  let enemySpeed = "10";
  let enemy = document.createElement("div");
  enemy.classList.add("enemy");
  let randomPosition = Math.floor(Math.random() * 750);
  enemy.style.bottom = randomPosition + "px";
  gameContainer.appendChild(enemy);
  moveEnemy(enemy, enemySpeed);

  let shootingInterval = 2000;

  let shootInterval = setInterval(() => {
    if (document.body.contains(enemy)) {
      createEnemyBullet("50", "2", enemy);
    } else {
      clearInterval(shootInterval);
    }
  }, shootingInterval);

  enemy.addEventListener("animationend", () => {
    enemy.remove();
    clearInterval(shootInterval);
  });
}
export function createDeathStar() {
  let enemySpeed = "30";
  let deathStar = document.createElement("div");
  deathStar.classList.add("deathStar");
  deathStar.setAttribute("data-life", "40"); // Asignar vida inicial de 10 golpes
  let randomPosition = Math.floor(Math.random() * 600);
  deathStar.style.bottom = randomPosition + "px";
  gameContainer.appendChild(deathStar);
  moveEnemy(deathStar, enemySpeed);

  let shootingInterval = 3000;

  let shootInterval = setInterval(() => {
    if (document.body.contains(deathStar)) {
      createDeathStarBullet("30", "30", deathStar);
    } else {
      clearInterval(shootInterval);
    }
  }, shootingInterval);

  deathStar.addEventListener("animationend", () => {
    deathStar.remove();
    clearInterval(shootInterval);
  });
}

export function shoot(e) {
  if (e.code === "Space") {
    createABullet("50", "2");
    audioLaserShoot();
  }
  if (e.code === "KeyM") {
    createMissile("50", "10");
    audioMissileShoot();
  }
}
export function createLife(lifes) {
  let life = document.querySelector(".life");
  if (life) life.remove(); // Eliminar la visualización anterior de vidas
  life = document.createElement("div");
  life.classList.add("life");
  life.style.width = "auto";
  gameContainer.appendChild(life);

  for (let i = 0; i < lifes; i++) {
    life.textContent += "❤️";
  }
}
export function decreaseLife(damage) {
  if (!damageCooldown && lifes > 0) {
    lifes -= damage;
    lifes = Math.max(0, lifes);
    updateLifeDisplay();

    damageCooldown = true;
    setTimeout(() => {
      damageCooldown = false;
    }, 500);

    if (lifes <= 0) {
      setIsDead(true);
      gameOver();
    }
  }
}
export function updateLifeDisplay() {
  let life = document.querySelector(".life");
  if (life) {
    life.textContent = "❤️".repeat(Math.floor(lifes));
  }
}
export function setExplosion(enemy) {
  if (enemy.classList.contains("deathStar")) {
    playExplosion("deathStar");
    animateExplosion(enemy, 300); // Tamaño de explosión para Death Star
  } else {
    playExplosion("enemy");
    animateExplosion(enemy, 150); // Tamaño de explosión para enemigo normal
  }
}

function playExplosion(type) {
  let audio;
  if (type === "deathStar") {
    audio = new Audio("ds-explosion.mp3");
  } else {
    audio = new Audio("explosion.mp3");
  }
  audio.play();
}

function animateExplosion(element, size) {
  element.classList.remove("enemy", "deathStar");
  element.classList.add("explosion");
  element.style.transition = "width 0.5s ease, height 0.5s ease";
  element.style.width = `${size}px`;
  element.style.height = `${size}px`;

  setTimeout(() => {
    element.remove();
  }, 500);
}

export function setDeathStarExplosion(deathStar) {
  deathStar.classList.remove("deathStar");
  deathStar.classList.add("explosion");
  deathStar.style.transition = "width 0.5s ease, height 0.5s ease";
  deathStar.style.width = "300px";
  deathStar.style.height = "300px";

  setTimeout(() => {
    deathStar.remove();
  }, 500);
}
function hideStartButton() {
  startBtn.style.display = "none";
}
export function getDamage() {
  player.style.filter = "brightness(200%)";
  setTimeout(() => {
    player.style.filter = "brightness(100%)";
  }, 200);
}
export function enemyGetDamage(enemy) {
  enemy.style.filter = "brightness(200%)";
  setTimeout(() => {
    enemy.style.filter = "brightness(100%)";
  }, 200);
}
export function deathStarGetDamage(deathStar) {
  deathStar.style.filter = "brightness(200%)";
  setTimeout(() => {
    deathStar.style.filter = "brightness(100%)";
  }, 200);
}
function gameOver() {
  // Recargar la página para reiniciar todo el juego
  location.reload();
}
function startAudio() {
  let audio = new Audio("DuelOfFates.mp3");
  audio.play();
}
function audioLaserShoot() {
  let audio = new Audio("laser.mp3");
  audio.play();
}
function audioMissileShoot() {
  let audio = new Audio("misil.mp3");
  audio.play();
}
