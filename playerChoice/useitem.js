import chalk from 'chalk';
import readlineSync from 'readline-sync';

export const Useitem = (player, monster, logs) => {
  console.log(chalk.magentaBright(`=====================`));
  console.log(
    chalk.yellow(`HP증가 포션 ${player.items.potion}개 보유중 포션을 사용하면 5~20 HP를 얻습니다`),
  );
  console.log(
    chalk.yellow(
      `\n화염 포션 ${player.items.fire}개 보유중 포션을 사용하면 몬스터에게 5~15의 데미지를 줍니다`,
    ),
  );
  console.log(
    chalk.yellow(
      `\n빙결 포션 ${player.items.ice}개 보유중 포션을 사용하면 1턴동안 몬스터를 얼립니다`,
    ),
  );
  console.log(chalk.magentaBright(`=====================`));
  console.log(
    `사용할 아이템을 선택하세요:`,
    chalk.green(`1.HP증가 포션  2.화염 포션  3.빙결 포션`),
  );
  const itemChoice = readlineSync.question('\n당신의 선택은? ');
  logs.push(chalk.green(`${itemChoice}를 선택하셨습니다.`));
  if (itemChoice === '1') {
    if (player.items.potion > 0) {
      const healing = player.usePotion();
      logs.push(
        chalk.greenBright(
          `HP증가 포션을 사용하여 HP가 ${healing} 증가되었습니다. 남은 포션 수: ${player.items.potion}`,
        ),
      );
    } else {
      logs.push(chalk.yellow('HP증가 포션이 없습니다.'));
    }
  }
  if (itemChoice === '2') {
    if (player.items.fire > 0) {
      const firedmg = player.fireAtk(monster);
      logs.push(
        chalk.redBright(
          `화염 포션을 사용하여 몬스터에게 ${firedmg}의 데미지를 입혔습니다. \n몬스터의 남은 HP: ${monster.hp} 남은 포션 수: ${player.items.fire}`,
        ),
      );
      if (monster.hp <= 0) {
        console.log(
          chalk.redBright(
            `화염 포션을 사용하여 몬스터에게 ${firedmg}의 데미지를 입혔습니다. \n몬스터의 남은 HP: ${(monster.hp = 0)} 남은 포션 수: ${player.items.fire}`,
          ),
        );
        console.log(chalk.yellow(`몬스터를 쓰러트렸습니다.`));
      }
    } else {
      logs.push(chalk.yellow('화염 포션이 없습니다.'));
    }
  }
  if (itemChoice === '3') {
    if (player.items.ice > 0) {
      player.iceAtk(monster);
      logs.push(
        chalk.blue(
          `빙결 포션을 사용하여 몬스터가 빙결되었습니다. 남은 포션 수: ${player.items.ice}`,
        ),
      );
    } else {
      logs.push(chalk.yellow('빙결 포션이 없습니다.'));
    }
  }
};