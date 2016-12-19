import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Grid, GaugeList } from '../src/index';

class App extends Component {
  render() {
    return (
      <Grid rows={2} cols={2} hideBorder={true}>
        <GaugeList row={0} col={0} rowSpan={1} colSpan={2} {...{
          gaugeSpacing: 0,
          gaugeHeight: 1,
          gauges:
            [ {showLabel: false, stack: [{percent: 30, stroke: 'green'}, {percent: 30, stroke: 'magenta'}, {percent: 40, stroke: 'cyan'}] }
            , {showLabel: false, stack: [{percent: 40, stroke: 'yellow'}, {percent: 20, stroke: 'magenta'}, {percent: 40, stroke: 'green'}] }
            , {showLabel: false, stack: [{percent: 50, stroke: 'red'}, {percent: 10, stroke: 'magenta'}, {percent: 40, stroke: 'cyan'}] } ]
        }}/>
      </Grid>
    );
  }
}

const screen = blessed.screen();
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
render(<App />, screen);
