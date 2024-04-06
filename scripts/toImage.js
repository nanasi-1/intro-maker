import { sleep } from "./util.js";
import { Clone } from "./Clone.js";
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
  Clone.ctx = getCanvas().ctx;
  const costumes = await getCostumes();

  const background = new Clone(costumes.background);
  const box = new Clone(costumes.box);
  
  while (true) {
    box.toX(0);
    for (let x = 50; x > 0; x--) {
      box.moveX(x / 2);
      console.log(x)
      await sleep(30);
    }
    console.log('draw');
    await sleep(100);
  }
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}
