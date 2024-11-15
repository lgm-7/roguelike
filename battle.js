
const Battle = async (stage, player, monster) => {
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