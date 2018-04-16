const HUB = Object.create(null);
export default {
  emit(event, data) {
    (HUB[event] || []).forEach(handler => handler(data));
  },
  on(event, handler, context = null) {
    if (!HUB[event]) HUB[event] = [];
    HUB[event].push(handler.bind(context));
  },
  off(event, handler) {
    const i = (HUB[event] || []).findIndex(h => h === handler);
    if (i > -1) HUB[event].splice(i, 1);
  }
};
