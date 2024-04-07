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
  circle.setSize(100000);
  sprite.changeLayer(box, 1); // 一つ手前にずらす
  sprite.goToLayer(background, 'back'); // 最背面にずらす
  // box.setDeg(45);
  box.setSize(50);
  
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
    box.changeX(-x * 0.85);
    await sleep(30);
  }
  box.setX(-box.canvasWidth);
  for (let y = 20; y > 0 && !box.isTouchingEdge('top'); y--) {
    box.changeY(y / 0.54);
    await sleep(30);
  }
  box.setY(box.canvasHeight);

  // ぐるぐる
  while (true) {
    for (let x = 33; x > 0 && !box.isTouchingEdge('right'); x--) {
      box.changeX(x * 1.55);
      await sleep(30);
    }
    box.setX(box.canvasWidth)

    for (let y = 37; y > 0 && !box.isTouchingEdge('bottom'); y--) {
      box.changeY(-y / 1.2);
      await sleep(30);
    }
    box.setY(-box.canvasHeight);

    for (let x = 33; x > 0 && !box.isTouchingEdge('left'); x--) {
      box.changeX(-x * 1.55);
      await sleep(30);
    }
    box.setX(-box.canvasWidth);

    for (let y = 37; y > 0 && !box.isTouchingEdge('top'); y--) {
      box.changeY(y / 1.2);
      await sleep(30);
    }
    box.setY(box.canvasHeight);
  }
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}
