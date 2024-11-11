import chalk from 'chalk';
import readlineSync from 'readline-sync';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Player {
  constructor() {
    this.hp = 100;
    this.damage = 3;
  }

  attack(monster, stage) {
    // 플레이어의 공격
    const damage = getRandom(this.damage, 20)
    monster.takeDamage(damage)
    return damage
  }

  takeDamage(damage) {
    this.hp -= damage;
  }

  heal(healing) {
    this.hp += healing
    console.log(chalk.blueBright(`플레이어의 HP가 ${healing} 증가되었습니다`))
  }

  doubleatk(monster) {
    const damage = getRandom(this.damage, 20)
    monster.takeDamage(damage)
    return damage
  }

  increaseDamage(incdmg) {
    this.damage += incdmg;
    console.log(chalk.blueBright(`플레이어의 최소 공격력이 ${incdmg}증가하였습니다`))
  }
}


class Monster {
  constructor(stage) {
    this.hp = 30+(stage-1)*14;
    this.damage = 2+(stage-1)*1;
  }

  attack(player) {
    // 몬스터의 공격
    player.takeDamage(this.damage);
    return this.damage
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
      `| 플레이어 정보 HP:${player.hp} Attack:${player.damage}~20`,
    ) +
    chalk.redBright(
      `| 몬스터 정보 | HP:${monster.hp} Attack:${monster.damage}`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];
  while (player.hp > 0 && monster.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));

    console.log(
      chalk.green(
        `\n1. 공격한다. 2. 연속공격(40%) 3. 도망친다(10%).`,
      ),
    );
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch (choice) {
      case '1':
        const pa = player.attack(monster);
        logs.push(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`));

        // 몬스터의 HP가 0 이하인지 체크
        if (monster.hp <= 0) {
          console.log(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp = 0}`))
          console.log(chalk.yellow(`몬스터를 쓰러트렸습니다.`))
          break;
        } else {
          const ma = monster.attack(player);
          logs.push(chalk.blueBright(`몬스터에게 ${ma}의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`));
        }
        break;
      case '2':
        if (getRandom(1, 100) > 60) {
          const pa = player.attack(monster);
          const pa1 = player.doubleatk(monster);
          logs.push(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다.`));
          logs.push(chalk.redBright(`몬스터에게 ${pa1}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`));
          if (monster.hp <= 0) {
            console.log(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다.`))
            console.log(chalk.redBright(`몬스터에게 ${pa1}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp = 0}`))
            console.log(chalk.yellow(`몬스터를 쓰러트렸습니다.`))
            break;
          }
          else {
            const ma = monster.attack(player);
            logs.push(chalk.blueBright(`몬스터에게 ${ma}의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`));
          }
          break;
        }
        else {
          logs.push(chalk.redBright('연속공격을 실패했습니다'))
          const ma = monster.attack(player);
          logs.push(chalk.blueBright(`몬스터에게 ${ma}의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`));
          break;
        }
      case '3': if (getRandom(1, 100) > 90) {
        logs.push(chalk.yellow('몬스터에게서 도망칩니다.'));
        return 'run';
      } else {
        logs.push(chalk.yellowBright('도망에 실패했습니다'))
        const ma = monster.attack(player);
        logs.push(chalk.blueBright(`몬스터에게 ${ma}의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`));
        break;
      }
    }
  }

};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);
    const result = await battle(stage, player, monster);

    // 스테이지 클리어 및 게임 종료 조건
    if (monster.hp <= 0) {
      if (stage === 10) {
        console.log(chalk.green('게임 클리어'));
        break;
      } else {
        console.log(chalk.green('다음 스테이지로 이동합니다'))
        player.increaseDamage(getRandom(1,2))
        player.heal(getRandom(20, 40));
        stage++
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    else if (result === 'run') {
      if (stage === 10) {
        console.log(chalk.green('게임 클리어'));
        break;
      } else {
        console.log(chalk.yellow('도망쳤습니다. 다음 스테이지로 이동합니다'))
        stage++
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    if (player.hp <= 0) {
      console.log(chalk.red('게임 오버'));
      break;
    }
  }
}