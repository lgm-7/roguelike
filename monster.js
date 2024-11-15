import { getRandom } from './utils.js';

export class Monster {
    constructor(stage) {
      this.hp = 30 + (stage - 1) * 15 + getRandom(0, 14);
      this.damage = 2 + (stage - 1) * 1 + getRandom(0, 2);
      this.frozen = false;
    }
  
    attack(player) {
      // 몬스터의 공격
      if (this.frozen) {
        this.frozen = false;
        return 0;
      }
      player.takeDamage(this.damage);
      return this.damage;
    }
  
    takeDamage(damage) {
      this.hp -= damage;
    }
  }