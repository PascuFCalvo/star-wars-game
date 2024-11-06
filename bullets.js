import { enemyBulletSpeed, deathStarBulletSpeed } from "./app.js";

class Projectile {
  constructor(
    className,
    width,
    height,
    top,
    left,
    animationName,
    speed,
    container
  ) {
    this.element = document.createElement("div");
    this.element.classList.add(className);
    this.element.style.width = `${width}px`;
    this.element.style.height = `${height}px`;
    this.element.style.top = `${top}px`;
    this.element.style.left = `${left}px`;
    this.element.style.animation = `${animationName} ${speed}s forwards`;
    container.appendChild(this.element);

    // Eliminar el proyectil después de que termine la animación
    this.element.addEventListener("animationend", () => this.element.remove());
  }

  static setupAnimation(name, keyframes) {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(
      `@keyframes ${name} { ${keyframes} }`,
      styleSheet.cssRules.length
    );
  }
}

// Crear y configurar animaciones solo una vez
Projectile.setupAnimation(
  "moveBulletToRight",
  `
  0% { transform: translateX(0); }
  100% { transform: translateX(100vw); }
`
);

Projectile.setupAnimation(
  "moveBulletToLeft",
  `
  0% { transform: translateX(0); }
  100% { transform: translateX(-100vw); }
`
);

Projectile.setupAnimation(
  "moveMissileToRight",
  `
  0% { transform: translateX(0); }
  10% { transform: translateX(-100px); }
  20% { transform: translateY(-100px); }
  100% { transform: translateX(100vw); }
`
);

// Función para obtener posición del jugador
function getPlayerPosition() {
  return {
    top: parseInt(window.getComputedStyle(player).getPropertyValue("top")),
    left: parseInt(window.getComputedStyle(player).getPropertyValue("left")),
  };
}

// Crear tipos específicos de proyectiles usando la clase Projectile
export function createABullet(width, height) {
  const { top, left } = getPlayerPosition();
  new Projectile(
    "bullet",
    width,
    height,
    top,
    left + 50,
    "moveBulletToRight",
    0.5,
    gameContainer
  );
  new Projectile(
    "bullet",
    width,
    height,
    top + 45,
    left + 50,
    "moveBulletToRight",
    0.5,
    gameContainer
  );
}

export function createMissile(width, height) {
  const { top, left } = getPlayerPosition();
  new Projectile(
    "missile",
    width,
    height,
    top,
    left,
    "moveMissileToRight",
    2,
    gameContainer
  );
}

export function createEnemyBullet(width, height) {
  document.querySelectorAll(".enemy").forEach((enemy) => {
    const enemyTop = parseInt(
      window.getComputedStyle(enemy).getPropertyValue("top")
    );
    const enemyLeft = parseInt(
      window.getComputedStyle(enemy).getPropertyValue("left")
    );
    new Projectile(
      "enemyBullet",
      width,
      height,
      enemyTop + 40,
      enemyLeft,
      "moveBulletToLeft",
      enemyBulletSpeed,
      gameContainer
    );
    new Projectile(
      "enemyBullet",
      width,
      height,
      enemyTop + 50,
      enemyLeft,
      "moveBulletToLeft",
      enemyBulletSpeed,
      gameContainer
    );
  });
}

export function createDeathStarBullet(width, height) {
  document.querySelectorAll(".deathStar").forEach((deathStar) => {
    const deathStarTop = parseInt(
      window.getComputedStyle(deathStar).getPropertyValue("top")
    );
    const deathStarLeft = parseInt(
      window.getComputedStyle(deathStar).getPropertyValue("left")
    );
    new Projectile(
      "deathStarBullet",
      width,
      height,
      deathStarTop,
      deathStarLeft,
      "moveBulletToLeft",
      deathStarBulletSpeed,
      gameContainer
    );
    new Projectile(
      "deathStarBullet",
      width,
      height,
      deathStarTop + 100,
      deathStarLeft,
      "moveBulletToLeft",
      deathStarBulletSpeed,
      gameContainer
    );
    new Projectile(
      "deathStarBullet",
      width,
      height,
      deathStarTop + 200,
      deathStarLeft,
      "moveBulletToLeft",
      deathStarBulletSpeed,
      gameContainer
    );
  });
}
