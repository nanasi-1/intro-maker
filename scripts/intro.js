import { sleep } from "./util.js";
import Sprite from "./Sprite.js";
console.log('Hello World!');

const getCanvas = () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('root');
  const ctx = canvas.getContext('2d');
  const size = {w: canvas.width, h: canvas.height};
  return {
    canvas, ctx, 
    canvasX: canvas.width / 2,
    canvasY: canvas.height / 2
  };
}

const getCostumes = async () => {
  const costumeElem = document.getElementById('costume');
  /** @type {{[key: string]: HTMLElement}} */ const costumes = {};
  for (const elem of costumeElem.children) {
    costumes[elem.id] = elem;
  }
  return costumes;
}

const main = async () => {
  const {ctx, canvas, canvasX, canvasY} = getCanvas();
  const sprite = new Sprite(canvas);

  const costumes = await getCostumes();
  const background = sprite.clone(costumes.background);
  const box = sprite.clone(costumes.box);
  const circle = sprite.clone(costumes.circle);
  document.getElementById('costume').remove();
  box.to(-canvasX, -canvasY);
  
  // フェードイン
  circle.size(100000);
  await sleep(500);
  for (let s = 50, i = 50; s > 0 && i > 0; s -= s / 10, i--) {
    circle.size(s * 30);
    await sleep(25);
  }
  circle.size(0);

  while (true) {
    for (let x = 30; x > 0 && box.current.x < canvas.width - 100; x--) {
      box.moveX(x * 1.55);
      await sleep(30);
    }
    box.toX(canvas.width / 2);

    for (let y = 40; y > 0 && box.current.y < canvas.height - 100; y--) {
      box.moveY(y / 1.2);
      await sleep(30);
    }
    box.toY(canvas.height / 2);

    for (let x = 30; x > 0 && box.current.x > -canvas.width; x--) {
      box.moveX(-x * 1.55);
      await sleep(30);
    }
    box.toX(-canvas.width / 2);

    for (let y = 40; y > 0 && box.current.y > -canvas.height; y--) {
      box.moveY(-y / 1.2);
      await sleep(30);
    }
    box.toY(-canvas.height / 2);
  }
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}

/*
# キャンバスの端への移動について
- sizeHackモードを作って、キャンバスの外には出ないようにする
- その辺の数値が取得できるgetterを作る

# サイズについて
- domtoimageに頼らない、ctxで描画するCloneがあってもいいかも
 */