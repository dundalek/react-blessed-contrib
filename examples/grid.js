import React, { Component } from 'react';
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { render } from 'react-blessed';
import { Map, Grid, GridItem } from '../src/index';

class App extends Component {
  render() {
    return (
      <Grid rows={12} cols={12}>
        <Map row={0} col={0} rowSpan={4} colSpan={4} label="World Map" />
        <box row={4} col={4} rowSpan={4} colSpan={4}>My Box</box>
      </Grid>
    );
  }
}

const screen = blessed.screen();
render(<App />, screen);
