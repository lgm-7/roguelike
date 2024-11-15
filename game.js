import chalk from 'chalk';
import readlineSync from 'readline-sync';
import {setBattle} from "./battle.js";
import {setItem} from "./item.js";
import {setPlayer} from "./player.js";
import {setMonster} from "./monster.js";

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

setPlayer()

setMonster()

setItem()

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
      chalk.blueBright(`| 플레이어 정보 HP:${player.hp} Attack:${player.damage}~20`) +
      chalk.redBright(
        `| 몬스터 정보: ${monsterName(monster)} | HP:${monster.hp} Attack:${monster.damage}`,
      ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

function monsterName(monster) {
  if (monster instanceof Troll) {
    return '트롤';
  } else if (monster instanceof Witch) {
    return '마녀';
  } else if (monster instanceof Salamader) {
    return '샐래맨더';
  } else {
    return '스켈레톤';
  }
}

setBattle()

export async function startGame() {
  console.clear();
  const player = new Player();
  const item = new Item();
  let stage = 1;

  while (stage <= 10) {
    let monster;
    if (stage === 3 || stage === 8) {
      monster = new Troll(stage);
    } else if (stage === 5) {
      monster = new Witch(stage);
    } else if (stage === 10) {
      monster = new Salamader(stage);
    } else {
      monster = new Monster(stage);
    }
    const result = await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if (monster.hp <= 0) {
      if (stage === 10) {
        console.log(chalk.green.bold('게임 클리어 ed1: 정복자'));
        break;
      } else {
        console.log(chalk.green('다음 스테이지로 이동합니다'));
        player.increaseDamage(getRandom(1, 2));
        player.heal(getRandom(28, 40));
        item.get(player);
        stage++;
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }
    } else if (result === 'run') {
      if (stage === 10) {
        console.log(chalk.green.bold('게임 클리어 ed2: 도망자'));
        break;
      } else {
        console.log(chalk.yellow('도망쳤습니다. 다음 스테이지로 이동합니다'));
        stage++;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    if (player.hp <= 0) {
      console.log(chalk.blueBright('플레이어가 몬스터에 공격을 맞고 쓰러졌다'));
      console.log(chalk.red('게임 오버'));
      break;
    }
  }
}
