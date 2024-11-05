let player = document.getElementById("player");
let score = document.getElementById("score");
let startBtn = document.getElementById("startButton");
let gameContainer = document.getElementById("gameContainer");
let spawnTime = 4000;
let deathStarSpawnTime = 10000;
let deathStarSpeed = 20;
let deathStarBulletSpeed = 5;
let enemySpeed = 10;
let enemyBulletSpeed = 4;
let isDead = false;
let lifes = 5;
let damageCooldown = false; // Variable para evitar llamadas simultáneas

score.innerHTML = 0;

document.addEventListener("keydown", movePlayer);
startBtn.addEventListener("click", start);
startBtn.addEventListener("click", hideStartButton);
document.addEventListener("keydown", shoot);

function resetGame() {
  isDead = false;
  lifes = 5; // Reiniciar vidas a 5
  createLife(lifes);
  let enemies = document.querySelectorAll(".enemy");
  enemies.forEach((enemy) => enemy.remove());
  score.innerHTML = 0;
}

function movePlayer(e) {
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

function moveEnemy(enemy) {
  enemy.style.animation = `moveEnemy ${enemySpeed}s linear`;
}

function setIsDead(value) {
  if (value !== true && value !== false) {
    return;
  }
  isDead = value;
}

setInterval(() => {
  checkBulletCollisionWithEnemies();
  checkPlayerCollisionWithEnemies();
  checkEnemyBulletCollisionWithPlayer();
  checkBulletCollisionWithDeathStar();
  checkDeathStarBulletCollisionWithPlayer();
  checkMissileCollisionWithEnemies();
  checkMissileCollisionWithDeathStar();
}, 16);
function increaseScore(value) {
  if (value === "increase") {
    let currentScore = parseInt(score.innerHTML);
    score.innerHTML = currentScore + 1;
  }
  return score.innerHTML;
}

function start() {
  resetGame();
  startAudio();
  setInterval(() => {
    createEnemy();
  }, spawnTime);
  setInterval(() => {
    createDeathStar();
  }, deathStarSpawnTime);
}

function createEnemy() {
  let enemy = document.createElement("div");
  enemy.classList.add("enemy");
  let randomPosition = Math.floor(Math.random() * 750);
  enemy.style.bottom = randomPosition + "px";
  gameContainer.appendChild(enemy);
  moveEnemy(enemy);

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

function createDeathStar() {
  let deathStar = document.createElement("div");
  deathStar.classList.add("deathStar");
  deathStar.setAttribute("data-life", "40"); // Asignar vida inicial de 10 golpes
  let randomPosition = Math.floor(Math.random() * 600);
  deathStar.style.bottom = randomPosition + "px";
  gameContainer.appendChild(deathStar);
  moveEnemy(deathStar);

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

function createABullet(width, height) {
  let bullet = document.createElement("div");
  let bullet2 = document.createElement("div");
  bullet2.classList.add("bullet");
  bullet2.style.width = `${width}px`;
  bullet2.style.height = `${height}px`;
  bullet.classList.add("bullet");
  bullet.style.width = `${width}px`;
  bullet.style.height = `${height}px`;

  // Posicionar el proyectil en la posición actual del jugador
  let playerTop = parseInt(
    window.getComputedStyle(player).getPropertyValue("top")
  );
  let playerLeft = parseInt(
    window.getComputedStyle(player).getPropertyValue("left")
  );
  bullet.style.top = playerTop + "px";
  bullet2.style.top = playerTop + 45 + "px";
  bullet.style.left = playerLeft + 50 + "px";
  bullet2.style.left = playerLeft + 50 + "px";

  // Calcular la distancia hasta el borde derecho de la pantalla
  let screenWidth = window.innerWidth;
  let distanceToEdge = screenWidth - (playerLeft + 50); // Distancia desde la bala hasta el borde derecho

  // Crear una animación dinámica para la bala
  bullet.style.animation = `moveBulletToRight 0.5s ease-in-out forwards`;
  bullet2.style.animation = `moveBulletToRight 0.5s ease-in-out forwards`;

  // Agregar el estilo de animación dinámico
  let styleSheet = document.styleSheets[0];
  styleSheet.insertRule(
    `
    @keyframes moveBulletToRight {
      0% { transform: translateX(0); }
      100% { transform: translateX(${distanceToEdge}px); }
    }
  `,
    styleSheet.cssRules.length
  );

  // Añadir el proyectil al contenedor del juego
  gameContainer.appendChild(bullet);
  gameContainer.appendChild(bullet2);

  // Eliminar el proyectil después de que termine la animación
  bullet.addEventListener("animationend", () => {
    bullet.remove();
  });
  bullet2.addEventListener("animationend", () => {
    bullet2.remove();
  });
}
function createMissile(width, height) {
  let missile = document.createElement("div");
  missile.classList.add("missile");
  missile.style.width = `${width}px`;
  missile.style.height = `${height}px`;

  // Posiciona el proyectil en la posición actual del jugador
  let playerTop = parseInt(
    window.getComputedStyle(player).getPropertyValue("top")
  );
  let playerLeft = parseInt(
    window.getComputedStyle(player).getPropertyValue("left")
  );
  missile.style.top = playerTop + "px";

  missile.style.left = playerLeft + "px";

  // Calcular la distancia hasta el borde derecho de la pantalla
  let screenWidth = window.innerWidth;
  let distanceToEdge = screenWidth - (playerLeft + 50); // Distancia desde la bala hasta el borde derecho

  // Crear una animación dinámica para la bala
  missile.style.animation = `moveBulletToRight 2s ease-in-out forwards`;

  // Agregar el estilo de animación dinámico
  let styleSheet = document.styleSheets[0];
  styleSheet.insertRule(
    //que primero salga un poco para atras, luego suba y
    `
    @keyframes moveBulletToRight {
      0% { transform: translateX(0); }
      10% { transform: translateX(-100px); }
      20% { transform: translateY(-100px); }
      100% { transform: translateX(${distanceToEdge}px); }
    }
  `,
    styleSheet.cssRules.length
  );

  // Añadir el proyectil al contenedor del juego
  gameContainer.appendChild(missile);

  // Eliminar el proyectil después de que termine la animación
  missile.addEventListener("animationend", () => {
    missile.remove();
  });
}

function createEnemyBullet(width, height) {
  let enemies = document.querySelectorAll(".enemy"); // Selecciona todos los enemigos actuales
  enemies.forEach((enemy) => {
    let enemyBullet = document.createElement("div");
    let enemyBullet2 = document.createElement("div");
    enemyBullet.classList.add("enemyBullet");
    enemyBullet2.classList.add("enemyBullet");
    enemyBullet.style.width = `${width}px`;
    enemyBullet2.style.width = `${width}px`;
    enemyBullet2.style.height = `${height}px`;
    enemyBullet.style.height = `${height}px`;

    // Posiciona el proyectil en la posición actual del enemigo
    let enemyTop = parseInt(
      window.getComputedStyle(enemy).getPropertyValue("top")
    );
    let enemyLeft = parseInt(
      window.getComputedStyle(enemy).getPropertyValue("left")
    );
    enemyBullet.style.top = enemyTop + 40 + "px";
    enemyBullet2.style.top = enemyTop + 50 + "px";
    enemyBullet.style.left = enemyLeft + "px";
    enemyBullet2.style.left = enemyLeft + "px";

    // Crea una animación para que la bala se mueva hacia la izquierda
    enemyBullet.style.animation = `moveBulletToLeft ${enemyBulletSpeed}s linear forwards`;
    enemyBullet2.style.animation = `moveBulletToLeft ${enemyBulletSpeed}s linear forwards`;

    // Añadir el proyectil al contenedor del juego
    gameContainer.appendChild(enemyBullet);
    gameContainer.appendChild(enemyBullet2);

    // Eliminar el proyectil después de que termine la animación
    enemyBullet.addEventListener("animationend", () => {
      enemyBullet.remove();
    });
    enemyBullet2.addEventListener("animationend", () => {
      enemyBullet2.remove();
    });
  });
}

function createDeathStarBullet(width, height) {
  let deathStars = document.querySelectorAll(".deathStar"); // Selecciona todos los enemigos actuales
  deathStars.forEach((deathStar) => {
    let deathStarBullet = document.createElement("div");
    let deathStarBullet2 = document.createElement("div");
    let deathStarBullet3 = document.createElement("div");
    deathStarBullet.classList.add("deathStarBullet");
    deathStarBullet2.classList.add("deathStarBullet");
    deathStarBullet3.classList.add("deathStarBullet");
    deathStarBullet.style.width = `${width}px`;
    deathStarBullet.style.height = `${height}px`;
    deathStarBullet2.style.width = `${width}px`;
    deathStarBullet2.style.height = `${height}px`;
    deathStarBullet3.style.width = `${width}px`;
    deathStarBullet3.style.height = `${height}px`;

    // Posiciona el proyectil en la posición actual del enemigo
    let deathStarTop = parseInt(
      window.getComputedStyle(deathStar).getPropertyValue("top")
    );
    let deathStarLeft = parseInt(
      window.getComputedStyle(deathStar).getPropertyValue("left")
    );
    deathStarBullet.style.top = deathStarTop + 0 + "px";
    deathStarBullet2.style.top = deathStarTop + 100 + "px";
    deathStarBullet3.style.top = deathStarTop + 200 + "px";
    deathStarBullet.style.left = deathStarLeft + "px";
    deathStarBullet2.style.left = deathStarLeft + "px";
    deathStarBullet3.style.left = deathStarLeft + "px";

    // Crea una animación para que la bala se mueva hacia la izquierda
    deathStarBullet.style.animation = `moveBulletToLeft ${deathStarBulletSpeed}s linear forwards`;
    deathStarBullet2.style.animation = `moveBulletToLeft ${deathStarBulletSpeed}s linear forwards`;
    deathStarBullet3.style.animation = `moveBulletToLeft ${deathStarBulletSpeed}s linear forwards`;

    // Añadir el proyectil al contenedor del juego
    gameContainer.appendChild(deathStarBullet);
    gameContainer.appendChild(deathStarBullet2);
    gameContainer.appendChild(deathStarBullet3);

    // Eliminar el proyectil después de que termine la animación
    deathStarBullet.addEventListener("animationend", () => {
      deathStarBullet.remove();
    });
    deathStarBullet2.addEventListener("animationend", () => {
      deathStarBullet2.remove();
    });
    deathStarBullet3.addEventListener("animationend", () => {
      deathStarBullet3.remove();
    });
  });
}

function shoot(e) {
  if (e.code === "Space") {
    createABullet("50", "2");
  }
  if (e.code === "KeyM") {
    createMissile("50", "10");
  }
}

function checkBulletCollisionWithEnemies() {
  let bullets = document.querySelectorAll(".bullet");
  let enemies = document.querySelectorAll(".enemy");

  bullets.forEach((bullet) => {
    let bulletRect = bullet.getBoundingClientRect();

    enemies.forEach((enemy) => {
      let enemyRect = enemy.getBoundingClientRect();

      if (
        bulletRect.right >= enemyRect.left &&
        bulletRect.left <= enemyRect.right &&
        bulletRect.top <= enemyRect.bottom &&
        bulletRect.bottom >= enemyRect.top
      ) {
        console.log("collision");
        bullet.remove();
        setExplosion(enemy);
        setTimeout(() => {
          enemy.remove();
        }, 500);
        increaseScore("increase");
      }
    });
  });
}
function checkBulletCollisionWithDeathStar() {
  let bullets = document.querySelectorAll(".bullet");
  let deathStars = document.querySelectorAll(".deathStar");

  bullets.forEach((bullet) => {
    let bulletRect = bullet.getBoundingClientRect();

    deathStars.forEach((deathStar) => {
      let deathStarRect = deathStar.getBoundingClientRect();

      if (
        bulletRect.right >= deathStarRect.left &&
        bulletRect.left <= deathStarRect.right &&
        bulletRect.top <= deathStarRect.bottom &&
        bulletRect.bottom >= deathStarRect.top
      ) {
        console.log("Collision with Death Star");
        bullet.remove();

        // Obtén y reduce la vida de la Death Star
        let currentLife = parseInt(deathStar.getAttribute("data-life"));
        currentLife -= 1;
        deathStar.setAttribute("data-life", currentLife);
        console.log("Death Star life remaining:", currentLife); // Verifica en consola

        // Si la vida llega a cero, explota la Death Star
        if (currentLife <= 0) {
          setDeathStarExplosion(deathStar);
          setTimeout(() => {
            deathStar.remove();
          }, 500);
          increaseScore("increase");
        }
      }
    });
  });
}
function checkPlayerCollisionWithEnemies() {
  let playerRect = player.getBoundingClientRect();
  let enemies = document.querySelectorAll(".enemy");

  enemies.forEach((enemy) => {
    let enemyRect = enemy.getBoundingClientRect();

    if (
      playerRect.right >= enemyRect.left &&
      playerRect.left <= enemyRect.right &&
      playerRect.top <= enemyRect.bottom &&
      playerRect.bottom >= enemyRect.top
    ) {
      console.log("collision");
      setIsDead(true);
    }
  });
}
function checkEnemyBulletCollisionWithPlayer() {
  let enemyBullets = document.querySelectorAll(".enemyBullet");
  let playerRect = player.getBoundingClientRect();

  enemyBullets.forEach((enemyBullet) => {
    let enemyBulletRect = enemyBullet.getBoundingClientRect();

    if (
      playerRect.right >= enemyBulletRect.left &&
      playerRect.left <= enemyBulletRect.right &&
      playerRect.top <= enemyBulletRect.bottom &&
      playerRect.bottom >= enemyBulletRect.top
    ) {
      console.log("bullet collision");
      enemyBullet.remove();
      decreaseLife(1);
      getDamage();
    }
  });
}
function checkDeathStarBulletCollisionWithPlayer() {
  let deathStarBullets = document.querySelectorAll(".deathStarBullet");
  let playerRect = player.getBoundingClientRect();

  deathStarBullets.forEach((deathStarBullet) => {
    let deathStarBulletRect = deathStarBullet.getBoundingClientRect();

    if (
      playerRect.right >= deathStarBulletRect.left &&
      playerRect.left <= deathStarBulletRect.right &&
      playerRect.top <= deathStarBulletRect.bottom &&
      playerRect.bottom >= deathStarBulletRect.top
    ) {
      console.log("bullet collision");
      deathStarBullet.remove();
      decreaseLife(2);
      getDamage();
    }
  });
}
function checkMissileCollisionWithEnemies() {
  let missiles = document.querySelectorAll(".missile");
  let enemies = document.querySelectorAll(".enemy");

  missiles.forEach((missile) => {
    let missileRect = missile.getBoundingClientRect();

    enemies.forEach((enemy) => {
      let enemyRect = enemy.getBoundingClientRect();

      if (
        missileRect.right >= enemyRect.left &&
        missileRect.left <= enemyRect.right &&
        missileRect.top <= enemyRect.bottom &&
        missileRect.bottom >= enemyRect.top
      ) {
        console.log("collision");
        missile.remove();
        setExplosion(enemy);
        setTimeout(() => {
          enemy.remove();
        }, 500);
        increaseScore("increase");
      }
    });
  });
}
function checkMissileCollisionWithDeathStar() {
  let missiles = document.querySelectorAll(".missile");

  let deathStars = document.querySelectorAll(".deathStar");

  missiles.forEach((missile) => {
    let missileRect = missile.getBoundingClientRect();

    deathStars.forEach((deathStar) => {
      let deathStarRect = deathStar.getBoundingClientRect();

      if (
        missileRect.right >= deathStarRect.left &&
        missileRect.left <= deathStarRect.right &&
        missileRect.top <= deathStarRect.bottom &&
        missileRect.bottom >= deathStarRect.top
      ) {
        console.log("Collision with Death Star");
        missile.remove();

        // Obtén y reduce la vida de la Death Star
        let currentLife = parseInt(deathStar.getAttribute("data-life"));
        currentLife -= 10;
        deathStar.setAttribute("data-life", currentLife);
        console.log("Death Star life remaining:", currentLife); // Verifica en consola

        // Si la vida llega a cero, explota la Death Star
        if (currentLife <= 0) {
          setDeathStarExplosion(deathStar);
          setTimeout(() => {
            deathStar.remove();
          }, 500);
          increaseScore("increase");
        }
      }
    });
  });
}

function createLife(lifes) {
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
function decreaseLife(damage) {
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
function updateLifeDisplay() {
  let life = document.querySelector(".life");
  if (life) {
    // Redondear la vida hacia abajo para mostrar un número entero de corazones
    life.textContent = "❤️".repeat(Math.floor(lifes));
  }
}
function setExplosion(enemy) {
  enemy.classList.remove("enemy");
  enemy.classList.add("explosion");

  enemy.style.transition = "width 0.5s ease, height 0.5s ease";
  enemy.style.width = "150px";
  enemy.style.height = "150px";

  setTimeout(() => {
    enemy.remove();
  }, 500);
}

function setDeathStarExplosion(deathStar) {
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
function getDamage() {
  player.style.filter = "brightness(200%)";
  setTimeout(() => {
    player.style.filter = "brightness(100%)";
  }, 500);
}
function gameOver() {
  // Recargar la página para reiniciar todo el juego
  location.reload();
}
function startAudio() {
  let audio = new Audio("DuelOfFates.mp3");
  audio.play();
}
