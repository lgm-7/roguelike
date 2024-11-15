import {setBattle} from "./battle.js";
import {setPlayer} from "./player.js";
import {setMonster} from "./monster.js";
setBattle()
setPlayer()
setMonster()

export function setItem() {
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
}