import React from 'react';
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
  return React.createElement('element', {}, props.children.map(child => {
    const props = child.props;
    const options = grid.set(props.row, props.col, props.rowSpan, props.colSpan, x => x, props.options);
    return React.cloneElement(child, options);
  }));
}

function GridItem(props) {
  return React.createElement(props.component, props, props.children)
}

Object.keys(contrib).forEach(key => {
  // todo check prototype
  if (contrib.hasOwnProperty(key) && blacklist.indexOf(key) === -1) {
    exports[upperFirst(key)] = createBlessedComponent(contrib[key], 'contrib-' + key);
  }

  exports.Grid = Grid;
  exports.GridItem = GridItem;
});
