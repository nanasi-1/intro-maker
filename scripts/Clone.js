export class Clone {
  costume;
  coordinate = {x: 0, y: 0};
  /** @type {Clone[]} */ static clones = [];
  /** @type {CanvasRenderingContext2D} */ static ctx;

  /**
   * @param {CanvasImageSource} costume 
   * @param {CanvasRenderingContext2D} ctx 
   */
  constructor (costume, ctx) {
    this.costume = costume;
    Clone.clones.push(this);
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
    Clone.render();
  }

  /** 現在の座標をもとに描画 */
  _render(ctx) {
    ctx.drawImage(this.costume, this.coordinate.x, this.coordinate.y);
  }

  static render() {
    this.ctx.clearRect(0, 0, 1000, 1000);
    for (const clone of Clone.clones) {
      clone._render(this.ctx);
    }
  }
}