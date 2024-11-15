import { Monster } from '../monster.js';

export class Salamander extends Monster {
    constructor(stage) {
      super(stage);
    }
    fire(player) {
      player.fire = 3;
    }
  }