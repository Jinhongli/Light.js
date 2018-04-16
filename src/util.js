export const extend = (target, ...sources) =>
  sources.reduce((result, source) => {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        result[key] = source[key];
      }
    }
    return result;
  }, target);
export const deepExtend = (target, ...sources) => {
  return sources.reduce((result, source) => {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        const value = source[key];
        if (value)
          result[key] =
            typeof value === 'object' ? deepExtend({}, value) : value;
      }
    }
    return result;
  }, target);
};

export const addEventListener = (
  el,
  type,
  handler,
  { context = null } = {}
) => {
  el.addEventListener(type, e => {
    const nodeName = e.target && e.target.getAttribute('l-node');
    handler.call(context, e, nodeName || '');
  });
};

export const ready = fn => {
  if (
    document.attachEvent
      ? document.readyState === 'complete'
      : document.readyState !== 'loading'
  ) {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

export const setStyle = (el, ruleName, val) => (el.style[ruleName] = val);

export const show = (...el) => [...el].forEach(e => (e.style.display = ''));
export const hide = (...el) => [...el].forEach(e => (e.style.display = 'none'));
