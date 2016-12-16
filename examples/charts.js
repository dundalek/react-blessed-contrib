import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';
import { Donut, Bar, Line } from '../src/index';

const getRandomNumber = (max) => Math.floor(Math.random() * (max || 10))
const getRandomArray = (length) => {
  const array = []
  while (length > 0) {
    array.push(getRandomNumber())
    length--
  }
  return array
}

const getRandomLineData = () => ({
  data: [
    {
      title: 'apples',
      x: ['t1', 't2', 't3', 't4'],
      y: getRandomArray(4),
      style: {line: 'red'}
    },
    {
      title: 'oranges',
      x: ['t1', 't2', 't3', 't4'],
      y: getRandomArray(4),
      style: {line: 'yellow'}
    }
  ]
})

class LineChart extends Component {
  constructor(props) {
    super(props);

    this.state = getRandomLineData()

    setInterval(() => {
      this.setState(getRandomLineData())
    }, 500);
  }

  render() {
    return (
      <Line
        ref='line'
        data={this.state.data}
        style={{style:{text: 'blue', baseline: 'black'}}}
        xLabelPadding={3}
        xPadding={5}
        showLegend={true}
        wholeNumbersOnly={false}
        height='50%'
        top='0%'
        label='Fruits' />
    );
  }
}


const getRandomBarData = () => ({
  titles: ['bar1', 'bar2'],
  data: [
    getRandomNumber(),
    getRandomNumber()
  ]
})

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.state = getRandomBarData()

    setInterval(() => {
      this.setState(getRandomBarData())
    }, 500);
  }

  render() {
    return (
      <Bar
        ref='bar'
        data={this.state}
        label='Server Utilization (%)'
        barWidth={4}
        barSpacing={6}
        xOffset={0}
        maxHeight={9}
        height='50%'
        top='50%'
        width='50%'
        left='0%' />
    );
  }
}

const getRandomDonutData = () => ({
  data: [
    {percent: getRandomNumber(100), label: 'rcp', 'color': 'green'},
    {percent: getRandomNumber(100), label: 'rcp', 'color': 'cyan'},
  ]
})

class Donuts extends Component {
  constructor(props) {
    super(props);

    this.state = getRandomDonutData()

    setInterval(() => {
      this.setState(getRandomDonutData())
    }, 500);
  }

  render() {
    return (
      <Donut
        ref='donuts'
        data={this.state.data}
        radius={8}
        arcWidth={3}
        spacing={2}
        yPadding={2}
        height='50%'
        top='50%'
        width='50%'
        left='50%'
        label='Donuts' />
    );
  }
}


class App extends Component {
  render() {
    return (
      <box>
        <BarChart />
        <LineChart />
        <Donuts />
      </box>
    );
  }
}


const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'react-blessed demo app'
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

const component = render(<App />, screen);
