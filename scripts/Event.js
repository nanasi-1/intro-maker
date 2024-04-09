export default class {
  #canvas;

  /**
   * 面倒なのでcanvasにイベントを発生させることにした
   * @param {HTMLCanvasElement} canvas イベントに使用
   */
  constructor(canvas) {
    this.#canvas = canvas;
  }

  /**
   * addEventListenerだけどまあいっか
   * @param {string} id イベントの識別子
   * @param {(e: Event) => any} func イベント発生時に実行する関数
   * @param {AddEventListenerOptions} option addEventListenerに渡されるオプション
   */
  register(id, func, option = {}) {
    this.#canvas.addEventListener(id, func, option);
  }

  dispatch(id) {
    const event = new CustomEvent(id);
    this.#canvas.dispatchEvent(event);
  }

  wait(id) {
    return new Promise(resolve => {
      this.register(id, resolve, {once: true});
    });
  }
}