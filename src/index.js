import React, { Component } from 'react';
import upperFirst from 'lodash.upperfirst';
import contrib from 'blessed-contrib';
import ReactBlessedComponent from 'react-blessed/dist/ReactBlessedComponent';
import ReactBlessedIDOperations from 'react-blessed/dist/ReactBlessedIDOperations';
import solveClass from 'react-blessed/dist/solveClass';

const blacklist = [ 'OutputBuffer', 'InputBuffer', 'createScreen', 'serverError', 'grid', 'carousel', 'markdown' ];

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

// Treat Markdown in a special way so that text can be passed as a child content
class Markdown extends ReactBlessedComponent {
  constructor() {
    super('contrib-markdown');
  }

  mountNode(parent, element) {
    const {props} = element,
    {children, ...options} = props;

    let opts = options;
    if (typeof children === 'string' && !opts.markdown) {
      opts.markdown = children;
    }

    const node = contrib.markdown(solveClass(opts));

    node.on('event', this._eventListener);
    parent.append(node);

    return node;
  }

  // Override mountComponent so that children are ignored
  mountComponent(rootID, transaction, context) {
    this._rootNodeID = rootID;

    // Mounting blessed node
    const node = this.mountNode(
      ReactBlessedIDOperations.getParent(rootID),
      this._currentElement
    );

    ReactBlessedIDOperations.add(rootID, node);

    // Rendering the screen
    ReactBlessedIDOperations.screen.debouncedRender();
  }
}

// We stub methods for contrib.grid to let it compute params for us which we then render in the React way
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

// We let the contrib.carousel manage state, re-rendering happens via move method that triggers component update
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
  exports.Markdown = Markdown;
});
