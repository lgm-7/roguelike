import chalk from 'chalk';
import readlineSync from 'readline-sync';

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Player {
  constructor() {
    this.hp = 100;
    this.damage = 3;
    this.defence = false;
    this.items = {
      dagger: 0,
      potion: 0,
      fire: 0,
      ice: 0,
      shield: 0,
    };
    this.fire = 0;
    this.debuf = false;
  }

  attack(monster) {
    // 플레이어의 공격
    if (this.debuf) {
      this.debuf = false;
      return 0;
    }
    const damage = getRandom(this.damage, 20);
    monster.takeDamage(damage);
    if (this.fire > 0) {
      this.hp--;
      this.fire--;
    }
    return damage;
  }

  takeDamage(damage) {
    if (this.defence) {
      damage = Math.floor(damage / 2);
      this.defence = false;
    }
    this.hp -= damage;
  }

  heal(hpmax) {
    this.hp += hpmax;
    console.log(chalk.blueBright(`플레이어의 HP가 ${hpmax} 증가되었습니다`));
  }

  doubleatk(monster) {
    const damage = getRandom(this.damage, 20);
    monster.takeDamage(damage);
    return damage;
  }

  increaseDamage(incdmg) {
    this.damage += incdmg;
    console.log(chalk.blueBright(`플레이어의 최소 공격력이 ${incdmg}증가하였습니다`));
  }

  usePotion() {
    const healing = getRandom(5, 20);
    this.heal(healing);
    this.items.potion -= 1;
    return healing;
  }

  addAtk(monster) {
    const aatk = getRandom(1, 2);
    monster.hp -= aatk;
    return aatk;
  }

  fireAtk(monster) {
    const fireatk = getRandom(5, 10);
    monster.hp -= fireatk;
    this.items.fire -= 1;
    return fireatk;
  }

  iceAtk(monster) {
    monster.frozen = true;
    this.items.ice -= 1;
  }

  Shield() {
    this.hp += 1;
  }

  def() {
    this.defence = true;
  }
}

class Monster {
  constructor(stage) {
    this.hp = 30 + (stage - 1) * 15 + getRandom(0, 14);
    this.damage = 2 + (stage - 1) * 1 + getRandom(0, 2);
    this.frozen = false;
  }

  attack(player) {
    // 몬스터의 공격
    if (this.frozen) {
      this.frozen = false;
      return 0;
    }
    player.takeDamage(this.damage);
    return this.damage;
  }

  takeDamage(damage) {
    this.hp -= damage;
  }
}

class Troll extends Monster {
  constructor(stage) {
    super(stage);
  }
  heal() {
    const heal = getRandom(1, 5);
    this.hp += heal;
    return heal;
  }
}

class Witch extends Monster {
  constructor(stage) {
    super(stage);
  }
  debuf(player) {
    player.debuf = true;
  }
}

class Salamader extends Monster {
  constructor(stage) {
    super(stage);
  }
  fire(player) {
    player.fire = 3;
  }
}

class Item {
  get(player, stage) {
    if (getRandom(1, 100) > 90) {  //단검
      if (player.items.dagger === 0) {
        player.items.dagger = 1;
        console.log(chalk.yellow('단검을 획득했습니다. 몬스터에게 1~2의 데미지를 추가로 줍니다'));
      } else {
        console.log(chalk.yellow('이미 단검을 가지고있습니다.'));
      }
    }

    if (getRandom(1, 100) > 70) {  //HP증가
      player.items.potion += 1;
      console.log(
        chalk.yellow('HP증가 포션을 획득했습니다. 포션을 사용하면 10~20의 HP를 얻습니다'),
      );
    }

    if (getRandom(1, 100) > 90) {  //화염
      player.items.fire += 1;
      console.log(
        chalk.yellow('화염 포션을 획득했습니다. 포션을 사용하면 몬스터에게 5~10의 데미지를 줍니다'),
      );
    }

    if (getRandom(1, 100) > 95) {  //빙결 
      player.items.ice += 1;
      console.log(
        chalk.yellow('빙결 포션을 획득했습니다. 포션을 사용하면 1턴동안 몬스터를 얼립니다'),
      );
    }

    if (getRandom(1, 100) > 90) {  //방패
      if (player.items.shield === 0) {
        player.items.shield = 1;
        console.log(chalk.yellow('방패를 획득했습니다. 몬스터로부터 1의 데미지를 경감해줍니다.'));
      } else {
        console.log(chalk.yellow('이미 방패를 가지고있습니다.'));
      }
    }

    if (getRandom(1, 10000) > 9999) {  //기계장치
      console.log(
        chalk.magenta.bold('\n갑작스럽게 이름모를 영웅이 나타나 몬스터를 전부 처리하고 사라졌다'),
      );
      console.log(chalk.green.bold('게임클리어 ed3:기계장치의 신'));
      process.exit();
    }

    if (getRandom(1, 100) > 95) {  //포션가방
      console.log(chalk.yellow('포션가방을 획득했습니다. 안에는 HP증가포션 3개가 들어있었습니다.'));
      player.items.potion += 3;
    }
  }
}

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
        if (player.debuf) {
          const ma = monster.attack(player);
          player.debuf = false;
          player.items.shield === 1 ? player.Shield() : '';
          logs.push(
            chalk.blueBright(`몬스터에게 ${ma}`) +
              chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
              chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
              chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
          );
        } else {
          const pa = player.attack(monster);
          logs.push(
            chalk.redBright(
              `몬스터에게 ${pa}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`,
            ),
          );
          if (player.items.dagger === 1) {
            const aatk = player.addAtk(monster);
            logs.push(
              chalk.redBright(
                `단검소지 효과로 몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`,
              ),
            );
          }
          if (monster.hp <= 0) {
            console.log(
              chalk.redBright(
                `몬스터에게 ${pa}의 피해를 입혔습니다. 몬스터의 남은 HP: ${(monster.hp = 0)}`,
              ),
            );
            if (player.items.dagger === 1) {
              const aatk = player.addAtk(monster);
              console.log(
                chalk.redBright(
                  `단검소지 효과로 몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${(monster.hp = 0)}`,
                ),
              );
            }
            console.log(chalk.yellow(`몬스터를 쓰러트렸습니다.`));
            break;
          } else {
            const ma = monster.attack(player);
            if (ma === 0) {
              logs.push(chalk.blue('몬스터가 빙결되어 공격하지 못했습니다.'));
            } else {
              player.items.shield === 1 ? player.Shield() : '';
              logs.push(
                chalk.blueBright(`몬스터에게 ${ma}`) +
                  chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
                  chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
                  chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
              );
            }
            if (monster instanceof Troll) {
              const msheal = monster.heal();
              logs.push(
                chalk.redBright(
                  `트롤의 재생력으로 몬스터가 ${msheal}의 HP를 회복 했습니다. 몬스터의 남은 HP: ${monster.hp}`,
                ),
              );
            }
            if (monster instanceof Witch) {
              if (getRandom(1, 100) > 85) {
                monster.debuf(player);
                logs.push(
                  chalk.blueBright(
                    '플레이어가 마녀의 저주를 받아 다음턴에 아이템 사용을 제외한 행동이 무시됩니다.',
                  ),
                );
              }
            }
            if (monster instanceof Salamader) {
              if (getRandom(1, 100) > 60) {
                monster.fire(player);
                logs.push(
                  chalk.blueBright(
                    '플레이어가 화상을 입었습니다 3턴동안 몬스터의 공격에 추가로 1의 데미지를 입습니다.',
                  ),
                );
              }
            }
          }
        }
        break;

      case '2': //doubleatk
        if (player.debuf) {
          const ma = monster.attack(player);
          player.debuf = false;
          player.items.shield === 1 ? player.Shield() : '';
          logs.push(
            chalk.blueBright(`몬스터에게 ${ma}`) +
              chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
              chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
              chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
          );
        } else {
          if (getRandom(1, 100) > 60) {
            const pa = player.attack(monster);
            const pa1 = player.doubleatk(monster);
            logs.push(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다.`));
            logs.push(
              chalk.redBright(
                `몬스터에게 ${pa1}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`,
              ),
            );
            if (player.items.dagger === 1) {
              const aatk = player.addAtk(monster);
              logs.push(
                chalk.redBright(
                  `단검소지 효과로 몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`,
                ),
              );
            }
            if (monster.hp <= 0) {
              console.log(chalk.redBright(`몬스터에게 ${pa}의 피해를 입혔습니다.`));
              console.log(
                chalk.redBright(
                  `몬스터에게 ${pa1}의 피해를 입혔습니다. 몬스터의 남은 HP: ${(monster.hp = 0)}`,
                ),
              );
              if (player.items.dagger === 1) {
                const aatk = player.addAtk(monster);
                console.log(
                  chalk.redBright(
                    `단검소지 효과로 몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${(monster.hp = 0)}`,
                  ),
                );
              }
              console.log(chalk.yellow(`몬스터를 쓰러트렸습니다.`));
              break;
            } else {
              const ma = monster.attack(player);
              if (ma === 0) {
                logs.push(chalk.blue('몬스터가 빙결되어 공격하지 못했습니다.'));
              } else {
                player.items.shield === 1 ? player.Shield() : '';
                logs.push(
                  chalk.blueBright(`몬스터에게 ${ma}`) +
                    chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
                    chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
                    chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
                );
              }
              if (monster instanceof Troll) {
                const msheal = monster.heal();
                logs.push(
                  chalk.redBright(
                    `트롤의 재생력으로 몬스터가 ${msheal}의 HP를 회복 했습니다. 몬스터의 남은 HP: ${monster.hp}`,
                  ),
                );
              }
              if (monster instanceof Witch) {
                if (getRandom(1, 100) > 85) {
                  monster.debuf(player);
                  logs.push(
                    chalk.blueBright(
                      '플레이어가 마녀의 저주를 받아 다음턴에 아이템 사용을 제외한 행동이 무시됩니다.',
                    ),
                  );
                }
              }
              if (monster instanceof Salamader) {
                if (getRandom(1, 100) > 60) {
                  monster.fire(player);
                  logs.push(
                    chalk.blueBright(
                      '플레이어가 화상을 입었습니다 3턴동안 몬스터의 공격에 추가로 1의 데미지를 입습니다.',
                    ),
                  );
                }
              }
            }
            break;
          } else {
            logs.push(chalk.redBright('연속공격을 실패했습니다'));
            const ma = monster.attack(player);
            if (ma === 0) {
              logs.push(chalk.blue('몬스터가 빙결되어 공격하지 못했습니다.'));
            } else {
              player.items.shield === 1 ? player.Shield() : '';
              logs.push(
                chalk.blueBright(`몬스터에게 ${ma}`) +
                  chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
                  chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
                  chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
              );
            }
            if (monster instanceof Troll) {
              const msheal = monster.heal();
              logs.push(
                chalk.redBright(
                  `트롤의 재생력으로 몬스터가 ${msheal}의 HP를 회복 했습니다. 몬스터의 남은 HP: ${monster.hp}`,
                ),
              );
            }
            if (monster instanceof Witch) {
              if (getRandom(1, 100) > 0) {
                monster.debuf(player);
                logs.push(
                  chalk.blueBright(
                    '플레이어가 마녀의 저주를 받아 다음턴에 아이템 사용을 제외한 행동이 무시됩니다.',
                  ),
                );
              }
            }
            if (monster instanceof Salamader) {
              if (getRandom(1, 100) > 60) {
                monster.fire(player);
                logs.push(
                  chalk.blueBright(
                    '플레이어가 화상을 입었습니다 3턴동안 몬스터의 공격에 추가로 1의 데미지를 입습니다.',
                  ),
                );
              }
            }
          }
        }
        break;

      case '3': //def
        if (player.debuf) {
          const ma = monster.attack(player);
          player.debuf = false;
          player.items.shield === 1 ? player.Shield() : '';
          logs.push(
            chalk.blueBright(`몬스터에게 ${ma}`) +
              chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
              chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
              chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
          );
        } else {
          if (getRandom(1, 100) > 35) {
            player.def();
            const ma = monster.attack(player);
            if (ma === 0) {
              logs.push(chalk.blue('몬스터가 빙결되어 공격하지 못했습니다.'));
            } else {
              player.items.shield === 1 ? player.Shield() : '';
              logs.push(
                chalk.blueBright(`방어에 성공하여 몬스터에게 ${Math.floor(ma / 2)}`) +
                  chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
                  chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
                  chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
              );
              if (monster instanceof Troll) {
                const msheal = monster.heal();
                logs.push(
                  chalk.redBright(
                    `트롤의 재생력으로 몬스터가 ${msheal}의 HP를 회복 했습니다. 몬스터의 남은 HP: ${monster.hp}`,
                  ),
                );
              }
            }
            const pa = player.attack(monster);
            logs.push(
              chalk.redBright(
                `반격으로 몬스터에게 ${pa}의 피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`,
              ),
            );
            if (player.items.dagger === 1) {
              const aatk = player.addAtk(monster);
              logs.push(
                chalk.redBright(
                  `단검소지 효과로 몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${monster.hp}`,
                ),
              );
            }
            if (monster.hp <= 0) {
              player.items.shield === 1 ? player.Shield() : '';
              console.log(
                chalk.blueBright(`방어에 성공하여 몬스터에게 ${Math.floor(ma / 2)}`) +
                  chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
                  chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
                  chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
              );
              console.log(
                chalk.redBright(
                  `반격으로 몬스터에게 ${pa}의 피해를 입혔습니다. 몬스터의 남은 HP: ${(monster.hp = 0)}`,
                ),
              );
              if (player.items.dagger === 1) {
                const aatk = player.addAtk(monster);
                console.log(
                  chalk.redBright(
                    `단검소지 효과로 몬스터에게 ${aatk}의 추가피해를 입혔습니다. 몬스터의 남은 HP: ${(monster.hp = 0)}`,
                  ),
                );
              }
              console.log(chalk.yellow(`몬스터를 쓰러트렸습니다.`));
              break;
            }
            break;
          } else {
            logs.push(chalk.redBright('방어에 실패했습니다'));
            const ma = monster.attack(player);
            if (ma === 0) {
              logs.push(chalk.blue('몬스터가 빙결되어 공격하지 못했습니다.'));
            } else {
              player.items.shield === 1 ? player.Shield() : '';
              logs.push(
                chalk.blueBright(`몬스터에게 ${ma}`) +
                  chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
                  chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
                  chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
              );
              player.fire--;
              if (monster instanceof Troll) {
                const msheal = monster.heal();
                logs.push(
                  chalk.redBright(
                    `트롤의 재생력으로 몬스터가 ${msheal}의 HP를 회복 했습니다. 몬스터의 남은 HP: ${monster.hp}`,
                  ),
                );
              }
              if (monster instanceof Witch) {
                if (getRandom(1, 100) > 85) {
                  monster.debuf(player);
                  logs.push(
                    chalk.blueBright(
                      '플레이어가 마녀의 저주를 받아 다음턴에 아이템 사용을 제외한 행동이 무시됩니다.',
                    ),
                  );
                }
              }
              if (monster instanceof Salamader) {
                if (getRandom(1, 100) > 60) {
                  monster.fire(player);
                  logs.push(
                    chalk.blueBright(
                      '플레이어가 화상을 입었습니다 3턴동안 몬스터의 공격에 추가로 1의 데미지를 입습니다.',
                    ),
                  );
                }
              }
            }
          }
        }
        break;

      case '4': //run
        if (player.debuf) {
          const ma = monster.attack(player);
          player.debuf = false;
          player.items.shield === 1 ? player.Shield() : '';
          logs.push(
            chalk.blueBright(`몬스터에게 ${ma}`) +
              chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
              chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
              chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
          );
          player.fire--;
        } else {
          if (getRandom(1, 100) > 95) {
            logs.push(chalk.yellow('몬스터에게서 도망칩니다.'));
            player.fire--;
            return 'run';
          } else {
            logs.push(chalk.yellowBright('도망에 실패했습니다'));
            const ma = monster.attack(player);
            if (ma === 0) {
              logs.push(chalk.blue('몬스터가 빙결되어 공격하지 못했습니다.'));
            } else {
              player.items.shield === 1 ? player.Shield() : '';
              logs.push(
                chalk.blueBright(`몬스터에게 ${ma}`) +
                  chalk.gray(`${player.items.shield === 1 ? ' -1' : ''}`) +
                  chalk.red(`${player.fire > 0 ? ' +1' : ''}`) +
                  chalk.blueBright(`의 피해를 입었습니다. 플레이어의 남은 HP: ${player.hp}`),
              );
              player.fire--;
              if (monster instanceof Troll) {
                const msheal = monster.heal();
                logs.push(
                  chalk.redBright(
                    `트롤의 재생력으로 몬스터가 ${msheal}의 HP를 회복 했습니다. 몬스터의 남은 HP: ${monster.hp}`,
                  ),
                );
              }
              if (monster instanceof Witch) {
                if (getRandom(1, 100) > 0) {
                  monster.debuf(player);
                  logs.push(
                    chalk.blueBright(
                      '플레이어가 마녀의 저주를 받아 다음턴에 아이템 사용을 제외한 행동이 무시됩니다.',
                    ),
                  );
                }
              }
              if (monster instanceof Salamader) {
                if (getRandom(1, 100) > 60) {
                  monster.fire(player);
                  logs.push(
                    chalk.blueBright(
                      '플레이어가 화상을 입었습니다 3턴동안 몬스터의 공격에 추가로 1의 데미지를 입습니다.',
                    ),
                  );
                }
              }
            }
          }
        }
        break;

      case '5': //item
        console.log(chalk.magentaBright(`=====================`));
        console.log(
          chalk.yellow(
            `HP증가 포션 ${player.items.potion}개 보유중 포션을 사용하면 5~20 HP를 얻습니다`,
          ),
        );
        console.log(
          chalk.yellow(
            `\n화염 포션 ${player.items.fire}개 보유중 포션을 사용하면 몬스터에게 5~10의 데미지를 줍니다`,
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
                `화염 포션을 사용하여 몬스터에게 ${firedmg}의 데미지를 입혔습니다. 남은 포션 수: ${player.items.fire}`,
              ),
            );
            if (monster.hp <= 0) {
              console.log(
                chalk.redBright(
                  `화염 포션을 사용하여 몬스터에게 ${firedmg}의 데미지를 입혔습니다. 남은 포션 수: ${player.items.fire}`,
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
