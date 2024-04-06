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
  /** @type {{[key: string]: HTMLImageElement}} */ const costumes = {};
  for (const elem of costumeElem.children) {
    const img = new Image();
    img.src = await domtoimage.toSvg(elem);
    costumes[elem.id] = img;
  }
  costumeElem.remove();
  return costumes;
}

const main = async () => {
  const {ctx, canvas} = getCanvas();
  const sprite = new Sprite(canvas, ctx);
  const circleElem = document.getElementById('circle');

  const costumes = await getCostumes();
  const background = sprite.add(costumes.background);
  const box = sprite.add(costumes.box);
  const circle = sprite.addFromElement(circleElem);
  
  while (true) {
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

    circle.writeStyle('transform', 'scale(1.1)')
  }
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}
