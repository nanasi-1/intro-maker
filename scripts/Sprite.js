import Clone from "./Clone.js";
import Blocks from './Block.js';

class CloneId {
  id;
  costume;
  /** @type {(Clone) => Promise<void>} */ block;
  constructor(cloneId, costume, block) {
    this.id = cloneId;
    this.costume = costume;
    this.block = block;
  }
}

export default class Sprite {
  static #alreadyCreate = false;
  #clones = [];
  /** @type {CloneId[]} */ #cloneIds = [];
  canvas;
  ctx;
  #blocks;

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
    this.#blocks = new Blocks();
  }

  /**
   * クローンの処理を新しく登録する
   * @param {string} cloneId クローンの識別子
   * @param {CanvasImageSource} costume 描画されるコスチューム
   * @param {(clone: Clone) => Promise<void>} block クローン時に実行される関数
   */
  whenClone(cloneId, costume, block) {
    const cloneIdObj = new CloneId(cloneId, costume, block);
    this.#cloneIds.push(cloneIdObj);
  }

  createClone(cloneId) {
    const id = this.#getCloneId(cloneId);
    const clone = new Clone(id.costume, this, cloneId);
    this.#clones.push(clone);
    this._render();
    id.block(clone, this);
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

  flag() {
    this.#clones.length = 0;
    this.#blocks.flag();
  }

  /**
   * イベントが発生した際の関数を追加
   * @param {(sprite: Sprite) => Promise<void>} func 関数
   */
  block(event, func) {
    this.#blocks.add(() => func(this));
  }
}