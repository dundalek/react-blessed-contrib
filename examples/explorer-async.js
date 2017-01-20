// Adapted from https://github.com/yaronn/blessed-contrib/blob/master/examples/explorer.js

// This is an experiment to make the Tree widget load children asynchronously.
// However, due to the Tree's current implementation it has very bad performance.
// Learn more at https://github.com/yaronn/blessed-contrib/issues/44

import fs from 'fs';
import path from 'path';
import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import { Grid, GridItem, Tree, Table } from '../src/index';

const promisify = func => (...args) => new Promise((resolve, reject) =>
  func(...args, (err, result) => err ? reject(err) : resolve(result)));

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
          children: self.children
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

  self.childrenContent = result;
  cb();
}

function createTree(cb) {
  //file explorer
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
    // Child generation function
    children: function(self) {
      var result = {};

      // childrenContent is a property filled with self.children() result
      // on tree generation (tree.setData() call)
      if (!self.childrenContent) {
        loadChildren(self, cb);
      } else {
        result = self.childrenContent;
      }

      return result;
    }
  }

  return explorer;
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
    this.explorer = createTree(() => {
      this.refs.tree.setData(this.explorer);
      screen.render();
    });
    this.props.screen.key(['tab'], (ch, key) => {
      const tree = this.refs.tree;
      const table = this.refs.table;
      if(screen.focused == tree.rows)
        table.focus();
      else
        tree.focus();
    });
    this.refs.tree.setData(this.explorer);
    this.refs.tree.focus();
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

  _onSelect = async (node) => {
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
