import chalk from 'chalk';
import readlineSync from 'readline-sync';
import {Player} from './player.js';
import {Item} from './item.js';
import {Troll} from './troll.js';
import {Witch} from './witch.js';
import {Salamander} from './salamander.js';
import {Monster} from './monster.js';
import {getRandom} from './utils.js';
import { Attack } from './atk.js';
import { DoubleAttack } from './doubleatk.js';
import { Defence } from './def.js';
import { Run } from './run.js';
import { Useitem } from './useitem.js';

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
  } else if (monster instanceof Salamander) {
    return '샐래맨더';
  } else {
    return '스켈레톤';
  }
}

const battle = async (stage, player, monster) => {
  let logs = [];
  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);
    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1.공격한다.  2.연속공격(40%)  3.방어하기(65%)  4.도망친다(5%).  5.아이템 사용`,
      ),
    );

    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch (choice) {
      case '1': //atk
        Attack(player,monster,logs)
        break;

      case '2': //doubleatk
       DoubleAttack(player,monster,logs)
        break;

      case '3': //def
        Defence(player,monster,logs)
        break;

      case '4': //run
        Run(player,monster,logs)
        break;

      case '5': //item
        Useitem(player,monster,logs)
        break;
    }
  }
};

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
      monster = new Salamander(stage);
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
        player.heal(getRandom(28, 50));
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
