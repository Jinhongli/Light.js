import { addEventListener, extend } from './util';
import EVENT from './eventHub';

const COMPS = { length: 0 };

class Component {
  constructor({
    el,
    id = `COMP_${COMPS.length}`,
    data = {},
    events = {},
    messages = {},
    ...props
  }) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el;
    this.id = id;
    this._initNodes();
    this._initData(data);
    this._initEvents(events);
    this._initMessages(messages);
    COMPS[id] = this;
    COMPS.length++;
    extend(this, props);
  }
  static getComponent(id) {
    return COMPS[id];
  }
  static postMessage(msg, data) {
    EVENT.emit(msg, data);
  }
  _initNodes() {
    const children = Array.from(this.el.getElementsByTagName('*'));
    this.nodes = {};
    this._binds = { html: {}, cls: {}, show: {}, attr: {} };

    children.forEach((node, index) => {
      node.getAttributeNames().forEach(attr => {
        const value = node.getAttribute(attr);
        if (attr === 'l-node') this.nodes[value] = node;
        if (attr === 'l-bind-html') this._binds.html[value] = node;
        if (attr === 'l-bind-class') this._binds.cls[value] = node;
        if (attr === 'l-show') this._binds.show[value] = node;
        if (attr.indexOf('l-attr-') >= 0) {
          this._binds.attr[value] = [node, attr.slice(7)];
        }
      });
    });
  }
  _initData(data) {
    const bindHtml = this._binds.html;
    const bindClass = this._binds.cls;
    const bindShow = this._binds.show;
    const bindAttr = this._binds.attr;
    this.data = {};
    let _data = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const value = data[key];
        Object.defineProperty(this.data, key, {
          get() {
            return _data[key];
          },
          set(newValue) {
            _data[key] = newValue;
            if (bindHtml[key]) {
              bindHtml[key].innerHTML = newValue;
            }
            if (bindClass[key]) {
              bindClass[key].className = newValue;
            }
            if (bindShow[key]) {
              bindShow[key].style.display = !!newValue ? '' : 'none';
            }
            if (bindAttr[key]) {
              const [node, attr] = bindAttr[key];
              if (typeof newValue === 'boolean') {
                if (newValue) {
                  node.setAttribute(attr, true);
                } else {
                  node.removeAttribute(attr);
                }
              } else if (typeof newValue === 'string') {
                node.setAttribute(attr, newValue);
              }
            }
          },
        });
        this.data[key] = value;
      }
    }
  }
  _initEvents(events) {
    if (!this.el)
      throw new Error('It seems you want use events withour specify `el`');
    for (const type in events) {
      if (events.hasOwnProperty(type)) {
        const handler = events[type];
        addEventListener(this.el, type, handler, { context: this });
      }
    }
  }
  _initMessages(messages) {
    for (const msg in messages) {
      if (messages.hasOwnProperty(msg)) {
        const handler = messages[msg];
        EVENT.on(msg, handler, this);
      }
    }
  }
}

export default Component;
