// Adapted from https://github.com/yaronn/blessed-contrib/blob/master/examples/markdown.js

import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Markdown } from '../src/index';
import chalk from 'chalk';

class App extends Component {
  componentDidMount() {
    this.refs.markdown.widget.setMarkdown('# Hello \n Testing `refs`.');
  }

  render() {
    return (
      <box>
        <Markdown style={{firstHeading: chalk.red.italic}}>{'# Hello \n This is **markdown** printed in the `terminal` 11'}</Markdown>
        <Markdown ref="markdown" top={3} style={{firstHeading: chalk.blue}} markdown={'# Hello \n This is **markdown** printed in the `terminal` 11'} />
      </box>
    );
  }
}

const screen = blessed.screen();
render(<App />, screen);
