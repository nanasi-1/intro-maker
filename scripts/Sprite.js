import Clone from "./Clone.js";

export default class Sprite {
  static #alreadyCreate = false;
  #clones = [];
  canvas;
  ctx;
  #isDelete = false;

  /**
   * スプライト=クローンの管理係
   * @param {HTMLCanvasElement} canvas 描画するキャンバス
   * @param {CanvasRenderingContext2D} ctx キャンバスのctx
   */
  constructor (canvas) {
    if(Sprite.#alreadyCreate) throw new Error('スプライトは一つまでです。すみません。');
    Sprite.#alreadyCreate = true;
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    this.ctx = ctx;
  }

  clone(img) {
    const clone = new Clone(img, this);
    this.#clones.push(clone);
    this._render();
    return clone;
  }

  _render() {
    if(this.#isDelete) return;
    this.ctx.clearRect(-this.canvas.width * 2, -this.canvas.height * 2, this.canvas.width * 4, this.canvas.height * 4);
    for (const clone of this.#clones) {
      clone._render(this.ctx);
    }
  }

  #deleteFromClones(clone) {
    if(!this.#clones.includes(clone)) throw new Error('クローンが見つかりませんでした');
    const index = this.#clones.indexOf(clone); // クローンが何番目か
    this.#clones.splice(index, 1)[0]; // 取り除く
    return index;
  }

  changeLayer(clone, count) {
    const index = this.#deleteFromClones(clone);
    this.#clones.splice(index + count, 0, clone);
    this._render();
  }

  /**
   * 最前面or最背面に移動する
   * @param {Clone} clone 移動するクローン
   * @param {'front' | 'back'} mode 最前面 or 最背面
   */
  goToLayer(clone, mode) {
    this.#deleteFromClones(clone);
    switch (mode) {
      case 'front':
        this.#clones.push(clone);
        break;
      case 'back':
        this.#clones.unshift(clone);
        break;
      default:
        throw new Error('modeはfrontかbackにしてください');
    }
    this._render();
  }

  deleteClone(clone) {
    this.#deleteFromClones(clone);
    this._render();
  }

  destroy() {
    this.#clones.length = 0;
    this.canvas = null;
    this.ctx = null;
    this.#isDelete = true;
  }
}