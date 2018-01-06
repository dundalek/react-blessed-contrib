import React, { Component } from 'react';
import upperFirst from 'lodash.upperfirst';
import blessed from 'blessed';
import contrib from 'blessed-contrib';

// Patch blessed so that react-blessed picks up our wrapper
blessed.__BLESSED_WRAPPER__ = function(props) { 
  return props.__BLESSED_WIDGET__(props);
}

const blacklist = [ 'OutputBuffer', 'InputBuffer', 'createScreen', 'serverError', 'grid', 'carousel', 'markdown' ];

function setWidgetData() {
  if (this.props.data) {
    this.widget.setData(this.props.data);
  }
}

export function createBlessedComponent(blessedElement) {
  return class extends Component {

    // data for chart widgets must be set after widget was added to screen
    componentDidMount = setWidgetData
    componentDidUpdate = setWidgetData

    render() {
      const { data, ...props } = this.props;
      return React.createElement('__BLESSED_WRAPPER__', {
        ...props,
        __BLESSED_WIDGET__: blessedElement,
        ref: (el) => this.widget = el,
      });
    }
  };
}

// Treat Markdown in a special way so that text can be passed as a child content
class Markdown extends Component {
  render() {
    const { children, ...props } = this.props;
    if (typeof children === 'string' && !props.markdown) {
      props.markdown = children;
    }
    return React.createElement('__BLESSED_WRAPPER__', {
      ...props,
      __BLESSED_WIDGET__: contrib.markdown,
      ref: (el) => this.widget = el,
    });
  }
};

// We stub methods for contrib.grid to let it compute params for us which we then render in the React way
function Grid(props) {
  const grid = new contrib.grid({...props, screen: { append: () => {} }});
  const children = props.children instanceof Array ? props.children : [props.children];
  return React.createElement(props.component || 'element', {}, children.map((child, key) => {
    const props = child.props;
    const options = grid.set(props.row, props.col, props.rowSpan, props.colSpan, x => x, props.options);
    options.key = key;
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

  componentDidUpdate() {
    this.props.screen.render();
  }

  render() {
    return this.props.children[this.state.page];
  }
}

Object.keys(contrib).forEach(key => {
  // todo check prototype
  if (contrib.hasOwnProperty(key) && blacklist.indexOf(key) === -1) {
    exports[upperFirst(key)] = createBlessedComponent(contrib[key]);
  }

  exports.Grid = Grid;
  exports.GridItem = GridItem;
  exports.Carousel = Carousel;
  exports.Markdown = Markdown;
});
