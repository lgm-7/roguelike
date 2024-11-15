import chalk from 'chalk';
import { getRandom } from '../utils.js';
import { Troll } from '../monsterList/troll.js';
import { Witch } from '../monsterList/witch.js';
import { Salamander } from '../monsterList/salamander.js';

export const Defence = (player, monster, logs) => {
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
  }
  // 몬스터 공격
  else {
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
        //몬스터 특수능력
        if (monster instanceof Troll) {
          const msheal = monster.heal();
          logs.push(
            chalk.redBright(
              `트롤의 재생력으로 몬스터가 ${msheal}의 HP를 회복 했습니다. 몬스터의 남은 HP: ${monster.hp}`,
            ),
          );
        }
      }
      //플레이어 반격
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
      }
      //방어실패
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
        //몬스터 특수능력
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
        if (monster instanceof Salamander) {
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
};