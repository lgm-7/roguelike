import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
  }

  attack(monster) {
    // 플레이어의 공격
    const damage = 12
    monster.takeDamage(damage)
    return damage
  }

  takeDamage(damage) {
    this.hp -= damage;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 100+ (stage-1) * 10;
  }

  attack(player) {
    // 몬스터의 공격
    const damage = 5;
    player.takeDamage(damage);
    return damage
  }

  takeDamage(damage) {
    this.hp -= damage;
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 정보 HP:${player.hp} Attack:${player.damage}`,
    ) +
    chalk.redBright(
      `| 몬스터 정보 | HP:${monster.hp} Attack:${monster.damage}`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while(player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다 2. 아무것도 하지않는다.`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch(choice) {
      case '1':
        const pa =player.attack(monster)
        logs.push(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`))
        if(monster.hp>0){
          const ma = monster.attack(player)
          logs.push(chalk.blueBright(`몬스터에게 ${ma}의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`));
        }
        break;
      case '2':logs.push(chalk.yellow('아무것도 하지 않았습니다.'));
       const ma = monster.attack(player)
       logs.push(chalk.blueBright(`몬스터에게 ${ma}의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`));
       break;
    }
  }
  
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if(player.hp <=0){
      console.log(chalk.red('게임 오버'));
      break;
    }

    stage++;
  }
}