import upperFirst from 'lodash.upperfirst';
import { node } from 'blessed';
import contrib from 'blessed-contrib';
import ReactBlessedComponent from 'react-blessed/dist/ReactBlessedComponent';
import solveClass from 'react-blessed/dist/solveClass';

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

Object.keys(contrib).forEach(key => {
  // todo check prototype
  if (contrib.hasOwnProperty(key) && contrib[key].prototype instanceof node) {
    exports[upperFirst(key)] = createBlessedComponent(contrib[key], 'contrib-' + key);
  }
});
