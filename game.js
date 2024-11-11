import chalk from 'chalk';
import readlineSync from 'readline-sync';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Player {
  constructor() {
    this.hp = 100;
    this.damage = 3;
    this.dagger = 0;
    this.potion = 0;
  }

  attack(monster) {
    // 플레이어의 공격
    const damage = getRandom(this.damage, 20)
    monster.takeDamage(damage)
    return damage
  }

  takeDamage(damage) {
    this.hp -= damage;
  }

  heal(hpmax) {
    this.hp += hpmax
    console.log(chalk.blueBright(`플레이어의 HP가 ${hpmax} 증가되었습니다`))
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

  usePotion() {
      const healing = getRandom(5, 10);
      this.heal(healing);
      this.potion -= 1;
      return healing;
    }    
    
    addAtk(monster) {
      const aatk = getRandom(1,2)
      monster.hp -=  aatk
      return aatk;
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

class Item {
  get(player) {
    const chance = getRandom(1,100)
    if(chance > 90) {
      if(player.dagger === 0){
        player.dagger = 1;
       console.log(chalk.yellow('단검을 획득했습니다. 1~2 데미지를 추가로 줍니다'));
      }else{ 
        console.log(chalk.yellow('이미 단검을 가지고있습니다.'));
      }
    }
     else 
      if(chance > 70) {
      player.potion += 1;
      console.log(chalk.yellow('포션을 획득했습니다. 포션을 사용하면 5~10 HP를 얻습니다'));
    }
  }

  def(player,defdmg) {
   
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
        `\n1. 공격한다. 2. 연속공격(40%) 3. 도망친다(10%). 4. 아이템 사용`,
      ),
    );
  
    const choice = readlineSync.question('당신의 선택은? ');

    // 플레이어의 선택에 따라 다음 행동 처리
    logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
    switch (choice) {
      case '1':
        const pa = player.attack(monster);
        logs.push(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`));
        if(player.dagger === 1 ) {
        const aatk = player.addAtk(monster)
        logs.push(chalk.redBright(`몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`));
        }
        // 몬스터의 HP가 0 이하인지 체크
        if (monster.hp <= 0) {
          console.log(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp = 0}`))
          if(player.dagger === 1 ) {
            const aatk = player.addAtk(monster)
            console.log(chalk.redBright(`몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp = 0}`));
            }
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
          if(player.dagger === 1 ) {
            const aatk = player.addAtk(monster)
            logs.push(chalk.redBright(`몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`));
            }
          if (monster.hp <= 0) {
            console.log(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다.`))
            console.log(chalk.redBright(`몬스터에게 ${pa1}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp = 0}`))
            if(player.dagger === 1 ) {
              const aatk = player.addAtk(monster)
              console.log(chalk.redBright(`몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp = 0}`));
              }
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
      case '4': 
      console.log(chalk.green(`사용할 아이템을 선택하세요: 1.HP증가 포션`));
      console.log(`HP증가 포션 ${player.potion}개 보유중`);
      const itemChoice = readlineSync.question('당신의 선택은? ');
      logs.push(chalk.green(`${itemChoice}를 선택하셨습니다.`));
       if (itemChoice === '1') {
        if(player.potion>0){
        const healing = player.usePotion()
        logs.push(chalk.yellow(`포션을 사용하여 HP가 ${healing} 증가되었습니다. 남은 포션 수: ${player.potion}`))
        } else {
          logs.push(chalk.yellow('포션이 없습니다.'));
        }
       }
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
        item.get(player)
        stage++
        await new Promise(resolve => setTimeout(resolve, 2500))
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