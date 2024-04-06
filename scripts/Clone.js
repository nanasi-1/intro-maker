export default class Sprite {
  static alreadyCreate = false;
  clones = [];
  canvas;
  ctx;

  constructor (canvas, ctx) {
    if(Sprite.alreadyCreate) throw new Error('スプライトは一つまでです。すみません。');
    Sprite.alreadyCreate = true;
    this.canvas = canvas;
    this.ctx = ctx;
  }

  add(img) {
    const clone = new Clone(img, this);
    this.clones.push(clone);
    return clone;
  }

  addFromElement(elem) {
    const clone = new CloneFromElement(elem, this);
    this.clones.push(clone);
    return clone;
  }

  _render() {
    this.ctx.clearRect(0, 0, 1000, 1000);
    for (const clone of this.clones) {
      clone._render(this.ctx);
    }
  }
}

export class Clone {
  costume;
  coordinate = {x: 0, y: 0};
  sprite;

  /**
   * @param {CanvasImageSource} costume 
   * @param {Sprite} sprite 
   */
  constructor (costume, sprite) {
    this.costume = costume;
    this.sprite = sprite;
  }

  /**
   * 何に使うんだろこれ
   * @param {(costume: CanvasImageSource, ctx: CanvasRenderingContext2D) => Promise<void>} block 
   */
  async program (block) {
    await block(this.costume, this.ctx);
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

  #move(prop, value) {
    this.coordinate[prop] = value;
    this.sprite._render();
  }

  /** 現在の座標をもとに描画 */
  _render(ctx) {
    ctx.drawImage(this.costume, this.coordinate.x, this.coordinate.y);
  }
}

export class CloneFromElement extends Clone {}