import { Monster } from './monster.js';
import { getRandom } from './utils.js';

export class Troll extends Monster {
    constructor(stage) {
      super(stage);
    }
    heal() {
      const heal = getRandom(1, 5);
      this.hp += heal;
      return heal;
    }
  }