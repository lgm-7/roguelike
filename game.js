import chalk from 'chalk';
import readlineSync from 'readline-sync';

class Player {
  constructor() {
    this.hp = 100;
  }

  attack() {
    // 플레이어의 공격
    const damage = 2
    Monster.takeDamage(damage)
    return Monster.hp
  }
}

class Monster {
  constructor() {
    this.hp = 100;
  }

  attack() {
    // 몬스터의 공격
  }

  takeDamage() {
    this.hp -= damage;
    console.log(`${damage}의 피해를 입혔습니다. 남은 HP ${this.hp}`)
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 정보`,
    ) +
    chalk.redBright(
      `| 몬스터 정보 |`,
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
        Player.attack(Monster);
        break;
      case '2':console.log(chalk.yellow('아무것도 하지 않았습니다.'));
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

    stage++;
  }
}