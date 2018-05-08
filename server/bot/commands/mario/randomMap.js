const fire = ':flames:';
const back = ':BLACK:';
const brick = ':MARIOBRICK:';
const mario = ':mario:';
const superMario = ':mario_run:';
const monster = ':mario_monster:';
const shroom = ':powerup:';

const player = {
  isSuper: false,
  x: 4,
  y: 5,
  jumped: false,
};

const pShroom = {
  x: 1,
  y: 5,
  onMap: false,
};

const playArea = new Array(8);

for (let i = 0; i < 8; i++) {
  playArea[i] = new Array(10);
}

const genPlayArea = () => {
  for (let i = 0; i < 10; i++) {
    playArea[0][i] = back;
    playArea[1][i] = back;
    playArea[2][i] = back;
    playArea[3][i] = back;
    playArea[4][i] = back;
    playArea[5][i] = brick;
    playArea[6][i] = back;
    playArea[7][i] = fire;
  }
  return playArea;
};
const setShroom = area => {
  if (pShroom.onMap && !player.isSuper) {
    area[pShroom.x][pShroom.y] = shroom;
    if (area[pShroom.x + 1][pShroom.y] !== brick) {
      pShroom.x++;
    }
  }
};
const setPlayer = area => {
  if (area[player.x][player.y] === monster && !player.jumped) {
    area[player.x][player.y] = back;
  }
  if (player.x === pShroom.x && player.y === pShroom.y) {
    area[player.x][player.y] = back;
    pShroom.onMap = false;
    player.isSuper = true;
  }
  const newArea = area.map(arr => arr.slice());

  newArea[player.x][player.y] = player.isSuper ? superMario : mario;
  setShroom(newArea);
  if (player.jumped) {
    if (newArea[player.x - 1][player.y] === brick) {
      pShroom.onMap = true;
    }
    player.x++;
    player.jumped = false;
  }

  return newArea;
};

const move = (area, lf) => {
  if (lf === 1) {
    //move right
    for (let i = 0; i < 8; i++) {
      area[i].shift();
    }
    area[0].push(back);
    area[1].push(back);
    area[2].push(Math.random() >= 0.15 ? back : brick);
    area[3].push(back);
    area[5].push(Math.random() >= 0.8 ? back : brick);
    area[4].push(
      Math.random() >= 0.9 && playArea[5][24] === brick ? monster : back,
    );
    area[6].push(back);
    area[7].push(fire);
  } else {
    for (let i = 0; i < 8; i++) {
      area[i].pop();
    }
    area[0].unshift(back);
    area[1].unshift(back);
    area[2].unshift(Math.random() >= 0.15 ? back : brick);
    area[3].unshift(back);
    area[5].unshift(Math.random() >= 0.8 ? back : brick);
    area[4].unshift(
      Math.random() >= 0.9 && playArea[5][24] === brick ? monster : back,
    );

    area[6].unshift(back);
    area[7].unshift(fire);
  }
  return area;
};

const jump = (player, area, lf = undefined) => {
  // lf - 0 back 1 right undefined
  if (lf) {
    area = move(area, lf);
  }
  player.x--;
  player.jumped = true;
  return area;
};

let pArea = genPlayArea();
pArea = move(pArea, 1);

const getRandomFrame = () => {
  if (pArea[5][6] !== brick || pArea[4][7] === monster) {
    pArea = jump(player, pArea, 1);
  } else {
    pArea = move(pArea, 1);
  }
  return setPlayer(pArea)
    .map(e => e.join(''))
    .join('\n');
};

module.exports = {
  getRandomFrame,
};
