import { sleep } from "./util.js";
import Sprite from "./Clone.js";
console.log('Hello World!');

const getCanvas = () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('root');
  const ctx = canvas.getContext('2d');
  return {canvas, ctx};
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
  const {ctx, canvas} = getCanvas();
  const sprite = new Sprite(canvas, ctx);

  const costumes = await getCostumes();
  const background = sprite.add(costumes.background);
  const box = sprite.add(costumes.box);
  const circle = sprite.add(costumes.circle);

  document.getElementById('costume').remove();
  
  while (true) {
    for (let i = 0; i < 50; i++) {
      const size = i / 100;
      circle.writeStyle('transform', `scale(${size})`);
      circle.moveX(-1);
      await sleep(30);
    }

    for (let x = 30; x > 0 && box.coordinate.x < canvas.width - 100; x--) {
      box.moveX(x * 1.55);
      await sleep(30);
    }
    box.toX(canvas.width - 100);

    for (let y = 40; y > 0 && box.coordinate.y < canvas.height - 100; y--) {
      box.moveY(y / 1.2);
      await sleep(30);
    }
    box.toY(canvas.height - 100);

    for (let x = 30; x > 0 && box.coordinate.x > 0; x--) {
      box.moveX(-x * 1.55);
      await sleep(30);
    }
    box.toX(0);

    for (let y = 40; y > 0 && box.coordinate.y > 0; y--) {
      box.moveY(-y / 1.2);
      await sleep(30);
    }
    box.toY(0);
  }
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}
