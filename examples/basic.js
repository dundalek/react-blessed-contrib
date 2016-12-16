import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Bar } from '../src/index';

// Rendering a simple centered box with a bar chart
class App extends Component {
  render() {
    return (
      <box top="center"
           left="center"
           width="80%"
           height="80%"
           border={{type: 'line'}}
           style={{border: {fg: 'blue'}}}>
        <Bar
          label="Server Utilization (%)"
          barWidth={4}
          barSpacing={6}
          xOffset={0}
          maxHeight={9}
          data={{
            titles: ['bar1', 'bar2'],
            data: [5, 10]
          }}
        />
      </box>
    );
  }
}

// Creating our screen
const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed-contrib demo'
});

// Adding a way to quit the program
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Rendering the React app using our screen
const component = render(<App />, screen);

screen.render()
