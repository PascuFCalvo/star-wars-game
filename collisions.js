import {
  setExplosion,
  increaseScore,
  decreaseLife,
  getDamage,
  deathStarGetDamage,
  setIsDead,
} from "./app.js";

class CollisionChecker {
  static checkCollision(rect1, rect2) {
    return (
      rect1.right >= rect2.left &&
      rect1.left <= rect2.right &&
      rect1.top <= rect2.bottom &&
      rect1.bottom >= rect2.top
    );
  }

  static handleBulletCollision(bullet, target, isDeathStar = false) {
    bullet.remove();
    if (isDeathStar) {
      let currentLife = parseInt(target.getAttribute("data-life"));
      currentLife -= 1;
      target.setAttribute("data-life", currentLife);
      console.log("Death Star life remaining:", currentLife);

      deathStarGetDamage(target);

      if (currentLife <= 0) {
        setExplosion(target); // Usar setExplosion para Death Star también
        increaseScore("increase");
      }
    } else {
      setExplosion(target);
      increaseScore("increase");
    }
  }

  static checkBulletCollisionWithEnemies() {
    const bullets = document.querySelectorAll(".bullet");
    const enemies = document.querySelectorAll(".enemy");

    bullets.forEach((bullet) => {
      const bulletRect = bullet.getBoundingClientRect();
      enemies.forEach((enemy) => {
        const enemyRect = enemy.getBoundingClientRect();
        if (this.checkCollision(bulletRect, enemyRect)) {
          console.log("collision with enemy");
          this.handleBulletCollision(bullet, enemy);
        }
      });
    });
  }

  static checkBulletCollisionWithDeathStar() {
    const bullets = document.querySelectorAll(".bullet");
    const deathStars = document.querySelectorAll(".deathStar");

    bullets.forEach((bullet) => {
      const bulletRect = bullet.getBoundingClientRect();
      deathStars.forEach((deathStar) => {
        const deathStarRect = deathStar.getBoundingClientRect();
        if (this.checkCollision(bulletRect, deathStarRect)) {
          console.log("collision with Death Star");
          this.handleBulletCollision(bullet, deathStar, true);
        }
      });
    });
  }

  static checkPlayerCollisionWithEnemies() {
    const playerRect = player.getBoundingClientRect();
    const enemies = document.querySelectorAll(".enemy");

    enemies.forEach((enemy) => {
      const enemyRect = enemy.getBoundingClientRect();
      if (this.checkCollision(playerRect, enemyRect)) {
        console.log("player collision with enemy");
        setIsDead(true);
      }
    });
  }

  static handlePlayerBulletCollision(bullet, damage) {
    bullet.remove();
    decreaseLife(damage);
    getDamage();
  }

  static checkEnemyBulletCollisionWithPlayer() {
    const enemyBullets = document.querySelectorAll(".enemyBullet");
    const playerRect = player.getBoundingClientRect();

    enemyBullets.forEach((bullet) => {
      const bulletRect = bullet.getBoundingClientRect();
      if (this.checkCollision(playerRect, bulletRect)) {
        console.log("collision with enemy bullet");
        this.handlePlayerBulletCollision(bullet, 1);
      }
    });
  }

  static checkDeathStarBulletCollisionWithPlayer() {
    const deathStarBullets = document.querySelectorAll(".deathStarBullet");
    const playerRect = player.getBoundingClientRect();

    deathStarBullets.forEach((bullet) => {
      const bulletRect = bullet.getBoundingClientRect();
      if (this.checkCollision(playerRect, bulletRect)) {
        console.log("collision with Death Star bullet");
        this.handlePlayerBulletCollision(bullet, 2);
      }
    });
  }

  static handleMissileCollision(missile, target, isDeathStar = false) {
    missile.remove();
    if (isDeathStar) {
      let currentLife = parseInt(target.getAttribute("data-life"));
      currentLife -= 10;
      target.setAttribute("data-life", currentLife);
      console.log("Death Star life remaining:", currentLife);

      deathStarGetDamage(target);

      if (currentLife <= 0) {
        setExplosion(target); // Usar setExplosion para Death Star también
        increaseScore("increase");
      }
    } else {
      setExplosion(target);
      increaseScore("increase");
    }
  }

  static checkMissileCollisionWithEnemies() {
    const missiles = document.querySelectorAll(".missile");
    const enemies = document.querySelectorAll(".enemy");

    missiles.forEach((missile) => {
      const missileRect = missile.getBoundingClientRect();
      enemies.forEach((enemy) => {
        const enemyRect = enemy.getBoundingClientRect();
        if (this.checkCollision(missileRect, enemyRect)) {
          console.log("missile collision with enemy");
          this.handleMissileCollision(missile, enemy);
        }
      });
    });
  }

  static checkMissileCollisionWithDeathStar() {
    const missiles = document.querySelectorAll(".missile");
    const deathStars = document.querySelectorAll(".deathStar");

    missiles.forEach((missile) => {
      const missileRect = missile.getBoundingClientRect();
      deathStars.forEach((deathStar) => {
        const deathStarRect = deathStar.getBoundingClientRect();
        if (this.checkCollision(missileRect, deathStarRect)) {
          console.log("missile collision with Death Star");
          this.handleMissileCollision(missile, deathStar, true);
        }
      });
    });
  }
}

export default CollisionChecker;
