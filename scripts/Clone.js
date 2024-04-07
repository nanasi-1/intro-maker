export default class Clone {
  #current = {
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
      this.#current.y - this.#size.h * radio / 2,
      ctx.canvas.width * radio,
      ctx.canvas.height * radio
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

  moveX(x) {
    this.#change('x', this.#current.x + x);
  }

  toX(x) {
    this.#change('x', x);
  }

  moveY(y) {
    this.#change('y', this.#current.y + y);
  }

  toY(y) {
    this.#change('y', y);
  }

  to(x, y) {
    this.#change('x', x);
    this.#change('y', y);
  }

  size(s) {
    this.#change('size', s);
  }

  #change(prop, value) {
    this.#current[prop] = value;
    this.#sprite._render();
  }

  isTouchingEdge() {}

  get current() {
    return Object.create(this.#current);
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
