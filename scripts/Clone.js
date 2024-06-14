import Sprite from "./Sprite.js"; /** 型用 */

export default class Clone {
  #sprite;
  #elem;
  #img = null;
  custom;

  #current = {
    x: 0, 
    y: 0,
    size: 100,
    deg: 90,
    isShow: true,
    ghost: 0 // 透明度
  };
  /** @type {'no-started' | 'progress' | 'done'} */
  #imgStatus = 'no-started';
  #size = {
    w: 0,
    h: 0,
  }

  /**
   * @param {HTMLElement} elem 
   * @param {{size: {w: number, h: number}, sprite: Sprite, custom?: any}} args 
   * @param {Sprite} sprite 
   * @param {{w: number, h: number}} size クローンのサイズ
   */
  constructor (elem, args) {
    this.#sprite = args.sprite;
    this.#elem = elem;
    this.#size.w = args.size.w;
    this.#size.h = args.size.h;
    this.custom = args.custom ?? undefined;
  }

  /** 
   * 現在の情報をもとに描画 
   * @param {CanvasRenderingContext2D} ctx 描画に使用するctx
   */
  async _render(ctx) {
    if(!this.#current.isShow) return;
    if(this.#imgStatus === 'no-started') await this.#updateImage();
    if(this.#imgStatus === 'progress') return;
    ctx.save();
    const radio = this.#current.size / 100;
    const {x: currentX, y: currentY} = this._calcCoordinate(this.#current.x, -this.#current.y, this.#current.deg);

    ctx.rotate(Math.PI / 180 * (this.#current.deg - 90));
    ctx.globalAlpha = (100 - this.#current.ghost) / 100;
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
    this.#imgStatus = 'progress';
    const img = new Image();
    img.src = await domtoimage.toSvg(this.#elem);
    this.#img = img;
    this.#imgStatus = 'done';
  }

  // 動き

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

  setDeg(deg) {
    this.#setProp('deg', deg);
  }

  turn(deg) {
    this.#setProp('deg', this.#current.deg + deg);
  }

  // 見た目

  changeSize(s) {
    this.#setProp('size', this.#current.size + s);
  }

  setSize(s) {
    this.#setProp('size', s);
  }

  show() {
    this.#setProp('isShow', true);
  }

  hide() {
    this.#setProp('isShow', false);
  }

  setGhost(num) { // これ以外に実装できる画像効果ない
    const safeNum = num > 100 ? 100 : num < 0 ? 0 : num;
    this.#setProp('ghost', safeNum);
  }

  changeGhost(num) { // あれ、こう実装するつもりは...
    const afterNum = this.#current.ghost + num;
    const safeNum = afterNum > 100 ? 100 : afterNum < 0 ? 0 : afterNum;
    this.#setProp('ghost', safeNum);
  }

  /**
   * #currentの値を変更する
   * @param {'x' | 'y' | 'size' | 'deg' | 'isShow ' | 'ghost'} prop 
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
    this.#imgStatus = 'no-started';
    this.#sprite._render();
  }

  // 自身の情報のゲッター群
  get x() {
    return this.#current.x
  }

  get y() {
    return this.#current.y
  }

  get deg() {
    return this.#current.deg
  }

  get size() {
    return this.#current.size
  }
}
