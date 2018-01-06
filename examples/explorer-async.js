// Adapted from https://github.com/yaronn/blessed-contrib/blob/master/examples/explorer.js

import fs from 'fs';
import path from 'path';
import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import { Grid, GridItem, Tree, Table } from '../src/index';

const promisify = func => (...args) => new Promise((resolve, reject) =>
  func(...args, (err, result) => err ? reject(err) : resolve(result)));

var explorer = {
  name: '/',
  extended: true,
  // Custom function used to recursively determine the node path
  getPath: function(self) {
    // If we don't have any parent, we are at tree root, so return the base case
    if (!self.parent)
      return '';

    // Get the parent node path and add this node name
    return self.parent.getPath(self.parent) + '/' + self.name;
  },
};

async function loadChildren(self, cb) {
  var result = {};
  try {
    var selfPath = self.getPath(self);
    // List files in this directory
    var children = await promisify(fs.readdir)(selfPath + '/');

    // childrenContent is a property filled with self.children() result
    // on tree generation (tree.setData() call)
    for (var child in children) {
      child = children[child];
      var completePath = selfPath + '/' + child;
      if ((await promisify(fs.lstat)(completePath)).isDirectory()) {
        // If it's a directory we generate the child with the children generation function
        result[child] = {
          name: child,
          getPath: self.getPath,
          extended: false,
          children: { __placeholder__: { name: 'Loading...' } }
        };
      } else {
        // Otherwise children is not set (you can also set it to "{}" or "null" if you want)
        result[child] = {
          name: child,
          getPath: self.getPath,
          extended: false
        };
      }
    }
  } catch (e) {}

  self.childrenContent = self.children = result;
  cb();
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      tableData: [
        []
      ]
    }
  }

  componentDidMount() {
    this.props.screen.key(['tab'], (ch, key) => {
      const tree = this.refs.tree.widget;
      const table = this.refs.table.widget;
      if(screen.focused == tree.rows)
        table.focus();
      else
        tree.focus();
    });
    this.refs.tree.widget.focus();
    loadChildren(explorer, this._reRender);
  }

  render() {
    return (
      <Grid rows={1} cols={2}>
        <Tree ref="tree" row={0} col={0} rowSpan={1} colSpan={1} options={{
          style: {
            text: "red"
          },
          template: {
            lines: true
          },
          label: 'Filesystem Tree',
          onSelect: this._onSelect
        }}/>
        <Table ref="table" row={0} col={1} rowSpan={1} colSpan={1} options={{
          keys: true,
          fg: 'green',
          label: 'Informations',
          columnWidth: [
            24, 10, 10
          ],
          data: {
            headers: ['Info'],
            data: this.state.tableData
          }
        }}/>
      </Grid>
    );
  }

  _reRender = () => {
    this.refs.tree.widget.setData(explorer);
    screen.render();
  }

  _onSelect = async (node) => {
    loadChildren(node, this._reRender);
    var path = node.getPath(node);
    var data = [];

    // The filesystem root return an empty string as a base case
    if (path == '')
      path = '/';

    // Add data to right array
    data.push([path]);
    data.push(['']);
    try {
      // Add results
      data = data.concat(JSON.stringify(await promisify(fs.lstat)(path), null, 2).split("\n").map(function(e) {
        return [e]
      }));
      this.setState({ tableData: data });
    } catch (e) {
      this.setState({ tableData: [
        [e.toString()]
      ]});
    }
  }
}

var screen = blessed.screen()
screen.key([
  'escape', 'q', 'C-c'
], function(ch, key) {
  return process.exit(0);
});

render(<App screen={screen}/>, screen);
