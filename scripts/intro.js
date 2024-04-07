import { sleep } from "./util.js";
import Sprite from "./Sprite.js";
console.log('Hello World!');

const getCostumes = async () => {
  const costumeElem = document.getElementById('costume');
  /** @type {{[key: string]: HTMLElement}} */ const costumes = {};
  for (const elem of costumeElem.children) {
    costumes[elem.id] = elem;
  }
  return costumes;
}

const main = async () => {
  const canvas = document.getElementById('root');
  const sprite = new Sprite(canvas);

  const costumes = await getCostumes();
  const box = sprite.clone(costumes.box);
  const circle = sprite.clone(costumes.circle);
  const background = sprite.clone(costumes.background);
  document.getElementById('costume').remove();

  // 事前準備
  box.hide();
  box.setSize(20);
  circle.setSize(100000);
  sprite.changeLayer(box, 1); // 一つ手前にずらす
  sprite.goToLayer(background, 'back'); // 最背面にずらす
  
  // フェードイン
  await sleep(500);
  for (let s = 50, i = 35; s > 0 && i > 0; s -= s / 10, i--) {
    circle.setSize(s * 30);
    await sleep(25);
  }
  box.show();
  circle.hide();

  // boxを左上に
  for (let x = 35; x > 0 && !box.isTouchingEdge('left'); x--) {
    box.changeSize(x / 5);
    box.changeX(-x * 0.8);
    box.turn(x / 10);
    await sleep(30);
  }
  box.setSize(100);
  box.setX(-box.canvasWidth);
  box.setDeg(135);
  for (let y = 40; y > 0 && !box.isTouchingEdge('top'); y--) {
    box.changeY(y * 0.5);
    box.turn(y / 10);
    await sleep(30);
  }
  box.setY(box.canvasHeight);
  box.setDeg(90);

  // ぐるぐる
  while (true) {
    for (let x = 33; x > 0 && !box.isTouchingEdge('right'); x--) {
      box.changeX(x * 1.55);
      box.turn(x / 5.7);
      await sleep(30);
    }
    box.setX(box.canvasWidth)
    box.setDeg(90);

    for (let y = 33; y > 0 && !box.isTouchingEdge('bottom'); y--) {
      box.changeY(-y / 1);
      box.turn(y / 6);
      await sleep(30);
    }
    box.setY(-box.canvasHeight);
    box.setDeg(90);

    for (let x = 33; x > 0 && !box.isTouchingEdge('left'); x--) {
      box.changeX(-x * 1.55);
      box.turn(x / 5.7);
      await sleep(30);
    }
    box.setX(-box.canvasWidth);
    box.setDeg(90);

    for (let y = 33; y > 0 && !box.isTouchingEdge('top'); y--) {
      box.changeY(y / 1);
      box.turn(y / 6);
      await sleep(30);
    }
    box.setY(box.canvasHeight);
    box.setDeg(90);
  }
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}
