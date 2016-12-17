import React, { Component } from 'react';
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { render } from 'react-blessed';
import { Map, Grid, GridItem } from '../src/index';

// class OldApp extends Component {
//   componentDidMount() {
//     const grid = new contrib.grid({rows: 12, cols: 12, screen: this.refs.root});
//     grid.set(0, 0, 4, 4, contrib.map, {label: 'World Map'})
//     grid.set(4, 4, 4, 4, blessed.box, {content: 'My Box'})
//   }
//
//   render() {
//     return (
//       <element ref="root" />
//     );
//   }
// }

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
