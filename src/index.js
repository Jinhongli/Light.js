import { addEventListener, ready } from './util';
import Component from './component';

const ACTIONS = {};

export default {
  Component,
  postMessage: Component.postMessage,
  getComp: Component.getComponent,
  init(fn, events = {}) {
    for (const key in events) {
      if (events.hasOwnProperty(key)) {
        const [type, target] = key.split(' ');
        const handler = events[key];
        addEventListener(
          target ? document.querySelector(`#${target}`) : document,
          type,
          handler.bind(this)
        );
      }
    }
    ready(fn);
  },
};
