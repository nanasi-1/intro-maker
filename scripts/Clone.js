import Sprite from "./Sprite.js"; /** 型用 */

export default class Clone {
  #sprite;
  #elem;
  id;
  #img = null;

  #current = {
    x: 0, 
    y: 0,
    size: 100,
    deg: 90,
    isShow: true
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
  constructor (elem, sprite, id) {
    this.#sprite = sprite;
    this.#elem = elem;
    this.#size.w = elem.clientWidth;
    this.#size.h = elem.clientHeight;
    this.id = id;
  }

  /** 
   * 現在の情報をもとに描画 
   * @param {CanvasRenderingContext2D} ctx 描画に使用するctx
   */
  async _render(ctx) {
    if(!this.#current.isShow) return;
    if(!this.#isUpdateImage) await this.#updateImage();
    ctx.save();
    const radio = this.#current.size / 100;
    const {x: currentX, y: currentY} = this._calcCoordinate(this.#current.x, -this.#current.y, this.#current.deg);

    ctx.rotate(Math.PI / 180 * (this.#current.deg - 90));
    ctx.drawImage(
      this.#img, 
      currentX - this.#size.w * radio / 2,
      currentY - this.#size.h * radio / 2,
      this.#sprite.canvas.width * radio,
      this.#sprite.canvas.height * radio
    );

    ctx.restore();
  }

  _calcCoordinate(x, y, deg) {
    const radian = Math.PI / 180 * (90 - deg);
    const calcX = Math.cos(radian) * x - Math.sin(radian) * y;
    const calcY = Math.sin(radian) * x + y * Math.cos(radian);
    return {x: calcX, y: calcY};
  }

  /** 画像を更新 */
  async #updateImage() {
    const img = new Image();
    img.src = await domtoimage.toSvg(this.#elem);
    this.#img = img;
    this.#isUpdateImage = true;
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

  changeSize(s) {
    this.#setProp('size', this.#current.size + s);
  }

  setSize(s) {
    this.#setProp('size', s);
  }

  setDeg(deg) {
    this.#setProp('deg', deg);
  }

  turn(deg) {
    this.#setProp('deg', this.#current.deg + deg);
  }

  show() {
    this.#setProp('isShow', true);
  }

  hide() {
    this.#setProp('isShow', false);
  }

  /**
   * #currentの値を変更する
   * @param {'x' | 'y' | 'size' | 'deg' | 'isShow'} prop 
   * @param {number | boolean} value 
   */
  #setProp(prop, value) {
    this.#current[prop] = value;
    this.#sprite._render();
  }

  /**
   * 端に触れたか
   * @param {'top' | 'left' | 'bottom' | 'right'} direction 触れたかどうか調べる方角
   */
  isTouchingEdge(direction) {
    switch (direction) {
      case 'top':
        return this.canvasHeight <= this.#current.y;
      case 'right': 
        return this.canvasWidth <= this.#current.x;
      case 'left':
        return -this.canvasWidth >= this.#current.x;
      case 'bottom':
        return -this.canvasHeight >= this.#current.y;
    
      default:
        throw new Error('direction引数は top | left | bottom | right にしてください')
    }
  }

  /**
   * 自身のサイズを考慮したキャンバスの端の座標を返す
   * x座標版
   */
  get canvasWidth() {
    const radio = this.#current.size / 100;
    return this.#sprite.canvas.width / 2 - this.#size.w * radio / 2;
  }

  /**
   * 自身のサイズを考慮したキャンバスの端の座標を返す
   * y座標版
   */
  get canvasHeight() {
    const radio = this.#current.size / 100;
    return this.#sprite.canvas.height / 2 - this.#size.h * radio / 2;
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
