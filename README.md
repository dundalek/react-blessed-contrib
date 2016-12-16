# react-blessed-contrib

A wrapper for [blessed-contrib](https://github.com/yaronn/blessed-contrib) widgets to be rendered with [react-blessed](https://github.com/Yomguithereal/react-blessed).

## Installation

You can install `react-blessed-contrib` through npm:

```bash
npm install react@0.14.0 blessed react-blessed
npm install react-blessed-contrib
```

## Demo

For a quick demo you can clone this repository and check some of the examples:

```bash
git clone https://github.com/dundalek/react-blessed-contrib
cd react-blessed-contrib
npm install

# Some examples (code is in `examples/`)
npm run basic
npm run charts
```
## Usage

### Using components

Import components and render with React. You can mix them with native react-blessed components.

```js
import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Bar } from 'react-blessed-contrib';

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
const screen = blessed.screen();

// Rendering the React app using our screen
const component = render(<App />, screen);
```

### Wrapping a custom blessed widget

Say you have a custom blessed widget:
```js
const widget = myBlessedWidget();
screen.append(widget);
```

You can wrap it in a component and use like:
```js
import React from 'react';
import { render } from 'react-blessed';
import { createBlessedComponent } = 'react-blessed-contrib';

const MyBlessedWidget = createBlessedComponent(myBlessedWidget);

render(<MyBlessedWidget />, screen);
```

## License

MIT
