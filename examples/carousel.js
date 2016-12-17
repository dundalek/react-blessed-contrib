import React, { Component } from 'react';
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { render } from 'react-blessed';
import { Carousel, Map, Grid, GridItem, Line } from '../src/index';

class Info extends Component {
  render() {
    return <box top="80%" left="10%">click right-left arrows or wait 3 seconds for the next layout in the carousel</box>;
  }
}

class Page1 extends Component {
  render() {
    return (
      <element>
        <Grid rows={4} cols={4}>
          <GridItem row={1} col={0} rowSpan={2} colSpan={2} component={Line} options={{
            style: {
              line: "yellow",
              text: "green",
              baseline: "black"
            },
            xLabelPadding: 3,
            xPadding: 5,
            label: 'Stocks',
            data: {
              x: [
                't1', 't2', 't3', 't4'
              ],
              y: [5, 1, 7, 5]
            }
          }} />
          <GridItem row={1} col={2} rowSpan={2} colSpan={2} component={Map} options={{label: 'Servers Location'}} />
        </Grid>
        <Info />
      </element>
    );
  }
}

class Page2 extends Component {
  render() {
    const lineProps = {
      width: 80,
      height: 30,
      left: 15,
      top: 12,
      xPadding: 5,
      label: 'Title',
      data: [
        {
          title: 'us-east',
          x: [
            't1', 't2', 't3', 't4'
          ],
          y: [
            0, 0.0695652173913043, 0.11304347826087, 2
          ],
          style: {
            line: 'red'
          }
        }
      ]
    };
    return (
      <element>
        <Line {...lineProps} />
        <Info />
      </element>
    );
  }
}

class App extends Component {
  render () {
    return (
      <Carousel interval={3000} controlKeys={true} screen={screen}>
        <Page1 />
        <Page2 />
      </Carousel>
    );
  }
}

const screen = blessed.screen();
screen.key([
  'escape', 'q', 'C-c'
], function(ch, key) {
  return process.exit(0);
});
render(<App />, screen);
