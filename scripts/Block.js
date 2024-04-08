// スレッドはクローンから独立させることにした
// そもそもいるか、これ...?
// めっちゃ不安だけどまあいっか
export default class Blocks {
  /** @type {Promise<void>[]} */ 
  #blockList = [];

  /**
   * ブロックを追加する
   * @param {() => Promise<void>} block プロミスを返す関数
   */
  add(block) {
    this.#blockList.push(block);
  }
  flag() {
    Promise.all(this.#blockList.map(func => func()));
  }
}