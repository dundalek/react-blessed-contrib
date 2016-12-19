import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Picture } from '../src/index';

class App extends Component {
  render() {
    return (
      <Picture file="./node_modules/png-js/images/laptop.png" cols={95} onReady={() => screen.render()} />
    );
  }
}

const screen = blessed.screen();
render(<App />, screen);
