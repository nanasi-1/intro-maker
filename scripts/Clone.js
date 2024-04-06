export default class Sprite {
  static alreadyCreate = false;
  clones = [];
  canvas;
  ctx;

  /**
   * スプライト=クローンの管理係
   * @param {HTMLCanvasElement} canvas 描画するキャンバス
   * @param {CanvasRenderingContext2D} ctx キャンバスのctx
   */
  constructor (canvas, ctx) {
    if(Sprite.alreadyCreate) throw new Error('スプライトは一つまでです。すみません。');
    Sprite.alreadyCreate = true;
    this.canvas = canvas;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    this.ctx = ctx;
  }

  add(img) {
    const clone = new Clone(img, this);
    this.clones.push(clone);
    return clone;
  }

  _render() {
    this.ctx.clearRect(-(this.canvas.width / 2), -(this.canvas.height / 2), 10000, 10000);
    for (const clone of this.clones) {
      clone._render(this.ctx);

      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
    }
  }
}

export class Clone {
  coordinate = {
    x: 0, 
    y: 0,
    size: 100
  };
  #img = null;
  #sprite;
  #elem;
  #isUpdateImage = false;
  #size = {
    w: 0,
    h: 0,
  }

  /**
   * @param {HTMLElement} elem 
   * @param {Sprite} sprite 
   */
  constructor (elem, sprite) {
    this.#sprite = sprite;
    this.#elem = elem;
    this.#size.w = elem.clientWidth;
    this.#size.h = elem.clientHeight;
    console.log(this.#size);
  }

  /** 現在の座標をもとに描画 */
  async _render(ctx) {
    if(!this.#isUpdateImage) await this.#updateImage();
    ctx.drawImage(this.#img, this.coordinate.x - this.#size.w / 2, this.coordinate.y - this.#size.h / 2);
  }

  /** 画像を更新 */
  async #updateImage() {
    const img = new Image();
    img.src = await domtoimage.toSvg(this.#elem);
    this.#img = img;
    this.#isUpdateImage = true;
  }

  /**
   * 何に使うんだろこれ
   * @param {(costume: CanvasImageSource, ctx: CanvasRenderingContext2D) => Promise<void>} block 
   */
  async program (block) {
    await block(this.#img, this.ctx);
  }

  moveX(x) {
    this.#move('x', this.coordinate.x + x);
  }

  toX(x) {
    this.#move('x', x);
  }

  moveY(y) {
    this.#move('y', this.coordinate.y + y);
  }

  toY(y) {
    this.#move('y', y);
  }

  to(x, y) {
    this.#move('x', x);
    this.#move('y', y);
  }

  #move(prop, value) {
    this.coordinate[prop] = value;
    this.#sprite._render();
  }

  /**
   * スタイルを変更する、別に使わなければいいことに気づいた
   * @param {keyof CSSStyleDeclaration} prop 
   * @param {*} value 
   */
  writeStyle(prop, value) {
    this.#elem.style[prop] = value;
    this.#isUpdateImage = false;
    this.#sprite._render();
  }
}
