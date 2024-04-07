import Clone from "./Clone.js";

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
  constructor (canvas) {
    if(Sprite.alreadyCreate) throw new Error('スプライトは一つまでです。すみません。');
    Sprite.alreadyCreate = true;
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    this.ctx = ctx;
  }

  clone(img) {
    const clone = new Clone(img, this);
    this.clones.push(clone);
    return clone;
  }

  _render() {
    this.ctx.clearRect(-(this.canvas.width / 2), -(this.canvas.height / 2), 10000, 10000);
    for (const clone of this.clones) {
      clone._render(this.ctx);
    }
  }
}