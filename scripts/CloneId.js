// クローンIDごとの情報を管理する
export default class CloneId {
  id;
  costume;
  size = {
    w: 0,
    h: 0
  }
  /** @type {(Clone) => Promise<void>} */ block;

  /**
   * クローンの動きを登録する
   * @param {string} cloneId クローンの識別子
   * @param {HTMLElement} costume コスチューム
   * @param {(clone: Clone) => Promise<void>} block クローン時に実行される関数
   */
  constructor(cloneId, costume, block) {
    this.id = cloneId;
    this.costume = costume;
    this.block = block;
    this.size.w = costume.clientWidth || parseFloat(costume.style.width.replace('px', ''));
    this.size.h = costume.clientHeight || parseFloat(costume.style.height.replace('px', ''));
  }
}