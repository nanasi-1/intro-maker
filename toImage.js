console.log('Hello World!');

const main = async () => {
  const img = new Image();
  img.src = await domtoimage.toSvg(head);
  
  /** @type {HTMLCanvasElement} */
  const canvas = document.getElementById('root');
  const ctx = canvas.getContext('2d');
  costume.append(img);

  ctx.drawImage(img, 0, 0);
  console.log('done');
};

try {
  main();
} catch (e) {
  console.error('エラーが発生しました', e);
}