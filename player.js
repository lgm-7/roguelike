import {setBattle} from "./battle.js";
import {setItem} from "./item.js";
import {setMonster} from "./monster.js";
setBattle()
setItem()
setMonster()

export class Player {
    constructor() {
      this.hp = 100;
      this.damage = 3;
      this.defence = false;
      this.items = {
        dagger: 0,
        potion: 0,
        fire: 0,
        ice: 0,
        shield: 0,
      };
      this.fire = 0;
      this.debuf = false;
    }
  
    attack(monster) {
      // 플레이어의 공격
      if (this.debuf) {
        this.debuf = false;
        return 0;
      }
      const damage = getRandom(this.damage, 20);
      monster.takeDamage(damage);
      if (this.fire > 0) {
        this.hp--;
        this.fire--;
      }
      return damage;
    }
  
    takeDamage(damage) {
      if (this.defence) {
        damage = Math.floor(damage / 2);
        this.defence = false;
      }
      this.hp -= damage;
    }
  
    heal(hpmax) {
      this.hp += hpmax;
      console.log(chalk.blueBright(`플레이어의 HP가 ${hpmax} 증가되었습니다`));
    }
  
    doubleatk(monster) {
      const damage = getRandom(this.damage, 20);
      monster.takeDamage(damage);
      return damage;
    }
  
    increaseDamage(incdmg) {
      this.damage += incdmg;
      console.log(chalk.blueBright(`플레이어의 최소 공격력이 ${incdmg}증가하였습니다`));
    }
  
    usePotion() {
      const healing = getRandom(5, 20);
      this.heal(healing);
      this.items.potion -= 1;
      return healing;
    }
  
    addAtk(monster) {
      const aatk = getRandom(1, 2);
      monster.hp -= aatk;
      return aatk;
    }
  
    fireAtk(monster) {
      const fireatk = getRandom(5, 10);
      monster.hp -= fireatk;
      this.items.fire -= 1;
      return fireatk;
    }
  
    iceAtk(monster) {
      monster.frozen = true;
      this.items.ice -= 1;
    }
  
    Shield() {
      this.hp += 1;
    }
  
    def() {
      this.defence = true;
    }
  }
