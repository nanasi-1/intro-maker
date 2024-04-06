console.log('Hello World!');

const getCanvas = () => {
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('root');
  const ctx = canvas.getContext('2d');
  return {canvas, ctx};
}

const getCostumes = async () => {
  const costumeElem = document.getElementById('costume');
  const costumes = [];
  for (const elem of costumeElem.children) {
    const img = new Image();
    img.src = await domtoimage.toSvg(elem);
    costumes.push(img);
  }
  costumeElem.remove();
  return costumes;
}

const main = async () => {
  const {ctx} = getCanvas();
  const costumes = await getCostumes();
  for (const costume of costumes) {
    console.log('draw', costume);
    ctx.drawImage(costume, 0, 0);
  }
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}