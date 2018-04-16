const show = (...el) => [...el].forEach(e => (e.style.display = ''));
const hide = (...el) => [...el].forEach(e => (e.style.display = 'none'));

const MESSAGES = {
  NEXT_PAGE: function(data) {
    this.next();
  },
  PREV_PAGE: function(data) {
    this.prev();
  },
};

const EVENTS = {
  click: function(e, nodeName) {
    switch (nodeName) {
      case 'nextBtn':
        this.next();
        break;
      case 'prevBtn':
        this.prev();
        break;
    }
  },
};
class Page extends Light.Component {
  constructor({
    pageNum = 1,
    slidePage,
    messages = MESSAGES,
    // events = EVENTS,
    ...props
  } = {}) {
    super({ messages, ...props });
    this.index = 0;
    this.lastIndex = 0;
    this.pageNum = pageNum;
    this.slidePage = slidePage || this._slidePage;
  }
  next() {
    this.lastIndex = this.index;
    this.index = this.index < this.pageNum - 1 ? this.index + 1 : this.index;
    if (this.index !== 0 && this.index !== this.lastIndex) this.slidePage();
  }
  prev() {
    this.lastIndex = this.index;
    this.index = this.index > 0 ? this.index - 1 : this.index;
    if (this.index !== this.pageNum - 1 && this.index !== this.lastIndex)
      this.slidePage();
  }
  _slidePage(index = this.index, lastIndex = this.lastIndex) {
    show(this.nodes[`page${this.index}`]);
    hide(this.nodes[`page${this.lastIndex}`]);
  }
}

const page = new Page({
  el: '#page',
  pageNum: 4,
  slidePage(index = this.index, lastIndex = this.lastIndex) {
    this.nodes.pageWrap.style.left = -100 * index + '%';
    this.data.disNext = this.index === 3;
    this.data.disPrev = this.index === 0;
  },
  data: {
    disNext: false,
    disPrev: true,
  },
});

Light.init(
  function() {
    console.log('init');
  },
  {
    'click nextBtn': function() {
      console.log('next');
      this.postMessage('NEXT_PAGE');
    },
    'click prevBtn': function() {
      this.postMessage('PREV_PAGE');
    },
  }
);
