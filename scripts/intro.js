import { sleep, getCostumeElements } from "./util.js";
import Sprite from "./Sprite.js";
console.log('Hello World!');

const costumeElem = document.getElementById('costume');
const canvas = document.getElementById('root');
const sprite = new Sprite(canvas, async (control, {event}) => {
  // 背景
  control.createClone('background');
  // フェードイン
  control.createClone('circle');
  
  await event.wait('fadeInEnd');
  while (true) {
    control.createClone('box');
    await sleep(1000);
  }

  // flag実行時にこのループを止めないといけない
});
globalThis.sprite = sprite;

// コスチュームと動きの登録
const costumes = await getCostumeElements(costumeElem);

sprite.whenClone('box', costumes.box, async (box, {sprite, event}) => {
  // boxを左上に
  box.setSize(20);
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
  for (let x = 33; x > 0 && !box.isTouchingEdge('right'); x--) {
    box.changeX(x * 1.55);
    box.turn(x / 5.2);
    await sleep(30);
  }
  box.setX(box.canvasWidth)
  box.setDeg(90);

  for (let y = 33; y > 0 && !box.isTouchingEdge('bottom'); y--) {
    box.changeY(-y / 1);
    box.turn(y / 4.5);
    await sleep(30);
  }
  box.setY(-box.canvasHeight);
  box.setDeg(90);

  for (let x = 35; x > 0; x--) {
    box.changeX(-x * 1.55);
    box.turn(x / 5.5);
    await sleep(30);
  }
  box.setX(-box.canvasWidth);
  box.setDeg(90);

  // 1週したら削除
  sprite.deleteClone(box);
});

sprite.whenClone('circle', costumes.circle, async (circle, {sprite, event}) => {
  circle.setSize(100000);
  await sleep(500);
  for (let s = 50, i = 35; s > 0 && i > 0; s -= s / 10, i--) {
    circle.setSize(s * 30);
    await sleep(25);
  }
  event.dispatch('fadeInEnd');
  sprite.deleteClone(circle);
});

sprite.whenClone('background', costumes.background, async (bg, {sprite}) => {
  sprite.goToLayer(bg, 'back'); // 最背面にずらす
});

costumeElem.remove();
sprite.flag();
