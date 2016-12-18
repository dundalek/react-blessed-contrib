import React, { Component } from 'react';
import upperFirst from 'lodash.upperfirst';
import contrib from 'blessed-contrib';
import ReactBlessedComponent from 'react-blessed/dist/ReactBlessedComponent';
import solveClass from 'react-blessed/dist/solveClass';

const blacklist = [ 'OutputBuffer', 'InputBuffer', 'createScreen', 'serverError', 'grid' ];

export function createBlessedComponent(blessedElement, tag='') {
    return class extends ReactBlessedComponent {
      constructor() {
        super(tag);
      }

      mountNode(parent, element) {
        const {props} = element,
        {children, ...options} = props;

        const node = blessedElement(solveClass(options));

        node.on('event', this._eventListener);
        parent.append(node);

        return node;
      }
    }
}

function Grid(props) {
  const grid = new contrib.grid({...props, screen: { append: () => {} }});
  const children = props.children instanceof Array ? props.children : [props.children];
  return React.createElement('element', {}, children.map(child => {
    const props = child.props;
    const options = grid.set(props.row, props.col, props.rowSpan, props.colSpan, x => x, props.options);
    return React.cloneElement(child, options);
  }));
}

class GridItem extends Component {
  getItem() {
    return this._reactInternalInstance._instance.refs.item;
  }

  render() {
    const props = this.props;
    return React.createElement(props.component, {...props, ref: 'item'}, props.children);
  }
}

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0
    };
  }

  componentDidMount() {
    this.carousel = new contrib.carousel(this.props.children, this.props);
    this.carousel.move = () => {
      this.setState({
        page: this.carousel.currPage
      });
    }
    this.carousel.start();
  }

  render() {
    return this.props.children[this.state.page];
  }
}

Object.keys(contrib).forEach(key => {
  // todo check prototype
  if (contrib.hasOwnProperty(key) && blacklist.indexOf(key) === -1) {
    exports[upperFirst(key)] = createBlessedComponent(contrib[key], 'contrib-' + key);
  }

  exports.Grid = Grid;
  exports.GridItem = GridItem;
  exports.Carousel = Carousel;
});
