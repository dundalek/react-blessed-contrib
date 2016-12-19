import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Map, Grid, GridItem } from '../src/index';

class App extends Component {
  render() {
    return (
      <Grid rows={12} cols={12}>
        <GridItem row={0} col={0} rowSpan={4} colSpan={4} component={Map} options={{label: 'World Map'}} />
        <GridItem row={4} col={4} rowSpan={4} colSpan={4} component={'box'} options={{content: 'My Box'}} />
      </Grid>
    );
  }
}

const screen = blessed.screen();
render(<App />, screen);
