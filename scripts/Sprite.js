import Clone from "./Clone.js";
import CloneId from './CloneId.js';
import Event from "./Event.js";

export default class Sprite {
  static #alreadyCreate = false;
  #clones = [];
  /** @type {CloneId[]} */ #cloneIds = [];
  canvas;
  ctx;
  #main;

  /**
   * スプライト=クローンの管理係
   * @param {HTMLCanvasElement} canvas 描画するキャンバス
   * @param {(sprite: Sprite, args: {event: Event}) => Promise<void>} main flag時に実行される関数
   */
  constructor (canvas, main) {
    if(!(canvas instanceof HTMLCanvasElement)) {
      throw new TypeError('new Sprite()の第一引数はHTMLCanvasElementにしてください');
    }
    if(typeof main !== 'function') {
      throw new TypeError('new Sprite()の第二引数は関数にしてください');
    }

    if(Sprite.#alreadyCreate) throw new Error('スプライトは一つまでです。すみません。');
    Sprite.#alreadyCreate = true;
    
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width / 2, canvas.height / 2);
    this.ctx = ctx;
    this.#main = main;
  }

  /**
   * クローンの処理を新しく登録する
   * @param {string} cloneId クローンの識別子
   * @param {CanvasImageSource} costume 描画されるコスチューム
   * @param {(clone: Clone, args: {sprite: Sprite, event: Event}) => Promise<void>} block クローン時に実行される関数
   */
  whenClone(cloneId, costume, block) {
    if(!(costume instanceof HTMLElement)) throw new TypeError('costumeはHTMLElementにしてください');
    const func = typeof block === 'function' ? block : () => {};

    const canvasSize = {w: this.canvas.width, h: this.canvas.height};
    const cloneIdObj = new CloneId(cloneId, costume, canvasSize, func);
    this.#cloneIds.push(cloneIdObj);
  }

  /**
   * クローンを作成する。Spriteのコンストラクタの中で使う
   * @param {string} cloneId 登録したクローンID
   * @param {any} custom 自由に使える値
   */
  createClone(cloneId, custom) {
    const id = this.#getCloneId(cloneId);
    const clone = new Clone(id.costume, {sprite: this, size: id.size, custom});
    this.#clones.push(clone);
    this._render();

    const event = new Event(this.canvas);
    id.block(clone, {sprite: this, event});
  }

  #getCloneId(idStr) {
    const result = this.#cloneIds.find(cloneId => cloneId.id === idStr);
    if(result === undefined) throw new Error(`CloneId${idStr}が見つかりませんでした`);
    return result;
  }

  _render() {
    this.ctx.clearRect(-this.canvas.width * 2, -this.canvas.height * 2, this.canvas.width * 4, this.canvas.height * 4);
    for (const clone of this.#clones) {
      clone._render(this.ctx);
    }
  }

  #deleteFromClones(clone) {
    if(!this.#clones.includes(clone)) return;
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

  flag() {
    this.#clones.length = 0;
    const event = new Event(this.canvas);
    this.#main(this, {event});
  }
}