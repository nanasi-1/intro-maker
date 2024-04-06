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
  const {ctx} = getCanvas();
  const {box, background} = await getCostumes();
  
  for (let x = 600; x > 0; x -= (x + 8) / 12) {
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(box, x, 0);
    await sleep(30);
  }
  console.log('draw');
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}

async function sleep(sec) { 
  return new Promise(resolve => setTimeout(resolve, sec)); 
}
