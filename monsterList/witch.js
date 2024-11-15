import { Monster } from '../monster.js';

export class Witch extends Monster {
    constructor(stage) {
      super(stage);
    }
    debuf(player) {
      player.debuf = true;
    }
  }