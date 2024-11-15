import {setBattle} from "./battle.js";
import {setItem} from "./item.js";
import {setPlayer} from "./player.js";
setBattle()
setItem()
setPlayer()

export function setMonster() {
class Monster {
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
  
  class Troll extends Monster {
    constructor(stage) {
      super(stage);
    }
    heal() {
      const heal = getRandom(1, 5);
      this.hp += heal;
      return heal;
    }
  }
  
  class Witch extends Monster {
    constructor(stage) {
      super(stage);
    }
    debuf(player) {
      player.debuf = true;
    }
  }
  
  class Salamader extends Monster {
    constructor(stage) {
      super(stage);
    }
    fire(player) {
      player.fire = 3;
    }
  }
}