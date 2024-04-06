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
  const {head, append} = await getCostumes();
  
  ctx.drawImage(head, 0, 0);
  ctx.drawImage(append, 0, 100);
  console.log('draw');
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}