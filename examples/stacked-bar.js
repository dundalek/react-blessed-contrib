import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { StackedBar } from '../src/index';

const screen = blessed.screen();
render(<StackedBar {...{ label: 'Server Utilization (%)'
   , barWidth: 4
   , barSpacing: 6
   , xOffset: 0
   //, maxValue: 15
   , height: "40%"
   , width: "50%"
   , barBgColor: [ 'red', 'blue', 'green' ],
   data: { barCategory: ['Q1', 'Q2', 'Q3', 'Q4']
   , stackedCategory: ['US', 'EU', 'AP']
   , data:
      [ [ 7, 7, 5]
      , [8, 2, 0]
      , [0, 0, 0]
      , [2, 3, 2] ]
   }
}}/>, screen);
