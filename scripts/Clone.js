import Sprite from "./Sprite.js"; /** 型用 */

export default class Clone {
  #sprite;
  #elem;
  #img = null;

  #current = {
    x: 0, 
    y: 0,
    size: 100
  };
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
  }

  /** 
   * 現在の情報をもとに描画 
   * @param {CanvasRenderingContext2D} ctx 描画に使用するctx
   */
  async _render(ctx) {
    if(!this.#isUpdateImage) await this.#updateImage();
    const radio = this.#current.size / 100;
    ctx.drawImage(
      this.#img, 
      this.#current.x - this.#size.w * radio / 2, 
      -(this.#current.y) - this.#size.h * radio / 2,
      this.#sprite.canvas.width * radio,
      this.#sprite.canvas.height * radio
    );
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

  changeX(x) {
    this.#setProp('x', this.#current.x + x);
  }

  setX(x) {
    this.#setProp('x', x);
  }

  changeY(y) {
    this.#setProp('y', this.#current.y + y);
  }

  setY(y) {
    this.#setProp('y', y);
  }

  go(x, y) {
    this.#setProp('x', x);
    this.#setProp('y', y);
  }

  setSize(s) {
    this.#setProp('size', s);
  }

  #setProp(prop, value) {
    this.#current[prop] = value;
    this.#sprite._render();
  }

  /**
   * 端に触れたか
   * @param {'top' | 'left' | 'bottom' | 'right'} direction 触れたかどうか調べる方角
   */
  isTouchingEdge(direction) {
    const radio = this.#current.size / 100;
    const currentSizeW = this.#size.w * radio / 2;
    const currentSizeH = this.#size.h * radio / 2;
    const canvasW = this.#sprite.canvas.width / 2;
    const canvasH = this.#sprite.canvas.height / 2;

    switch (direction) {
      case 'top':
        return canvasH <= this.current.y + currentSizeH;
      case 'right': 
        return canvasW <= this.current.x + currentSizeW;
      case 'left':
        return -canvasW >= this.current.x - currentSizeW;
      case 'bottom':
        return -canvasH >= this.current.y - currentSizeH;
    
      default:
        throw new Error('direction引数は top | left | bottom | right にしてください')
    }
  }

  get current() {
    return this.#current;
  }

  /**
   * スタイルを変更する、別に使わなければいいことに気づいた
   * @param {keyof CSSStyleDeclaration} prop 
   * @param {*} value 
   */
  setStyle(prop, value) {
    this.#elem.style[prop] = value;
    this.#isUpdateImage = false;
    this.#sprite._render();
  }
}
