import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import { Grid, Donut, Sparkline, Bar, Table, Lcd, Line, Map, Log, Gauge } from '../src/index';

//dummy data
var servers = ['US1', 'US2', 'EU1', 'AU1', 'AS1', 'JP1']
var commands = ['grep', 'node', 'java', 'timer', '~/ls -l', 'netns', 'watchdog', 'gulp', 'tar -xvf', 'awk', 'npm install']

//set dummy data for table
function generateTable() {
   var data = []

   for (var i=0; i<30; i++) {
     var row = []
     row.push(commands[Math.round(Math.random()*(commands.length-1))])
     row.push(Math.round(Math.random()*5))
     row.push(Math.round(Math.random()*100))
     data.push(row)
   }

   return {headers: ['Process', 'Cpu (%)', 'Memory'], data: data};
}

//set line charts dummy data
var transactionsData = {
   title: 'USA',
   style: {line: 'red'},
   x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:30', '00:40', '00:50', '01:00', '01:10', '01:20', '01:30', '01:40', '01:50', '02:00', '02:10', '02:20', '02:30', '02:40', '02:50', '03:00', '03:10', '03:20', '03:30', '03:40', '03:50', '04:00', '04:10', '04:20', '04:30'],
   y: [0, 20, 40, 45, 45, 50, 55, 70, 65, 58, 50, 55, 60, 65, 70, 80, 70, 50, 40, 50, 60, 70, 82, 88, 89, 89, 89, 80, 72, 70]
}

var transactionsData1 = {
   title: 'Europe',
   style: {line: 'yellow'},
   x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:30', '00:40', '00:50', '01:00', '01:10', '01:20', '01:30', '01:40', '01:50', '02:00', '02:10', '02:20', '02:30', '02:40', '02:50', '03:00', '03:10', '03:20', '03:30', '03:40', '03:50', '04:00', '04:10', '04:20', '04:30'],
   y: [0, 5, 5, 10, 10, 15, 20, 30, 25, 30, 30, 20, 20, 30, 30, 20, 15, 15, 19, 25, 30, 25, 25, 20, 25, 30, 35, 35, 30, 30]
}

var errorsData = {
   title: 'server 1',
   x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:25'],
   y: [30, 50, 70, 40, 50, 20]
}

var latencyData = {
   x: ['t1', 't2', 't3', 't4'],
   y: [5, 1, 7, 5]
}

function getLineData(mockData, line) {
  for (var i=0; i<mockData.length; i++) {
    var last = mockData[i].y[mockData[i].y.length-1]
    mockData[i].y.shift()
    var num = Math.max(last + Math.round(Math.random()*10) - 5, 10)
    mockData[i].y.push(num)
  }

  return mockData;
}

function updateDonut(pct) {
  if (pct > 0.99) pct = 0.00;
  var color = "green";
  if (pct >= 0.25) color = "cyan";
  if (pct >= 0.5) color = "yellow";
  if (pct >= 0.75) color = "red";
  return [{percent: parseFloat((pct+0.00) % 1).toFixed(2), label: 'storage', 'color': color}];
}

var lcdColors = ['green','magenta','cyan','red','blue'];
var lcdText = ['A','B','C','D','E','F','G','H','I','J','K','L'];

class App extends Component {
  constructor() {
    super();
    this.state = {
      gauge_percent: 0,
      gauge_percent_two: 0,
      barData: undefined,
      tableData: generateTable(),
      transactionsLineData: getLineData([transactionsData, transactionsData1]),
      errorsLineData: getLineData([errorsData]),
      lcdValue: 0,
      donutPct: 0.00,
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({ gauge_percent: (this.state.gauge_percent + 1) % 100 });
    }, 200);

    setInterval(() => {
      this.setState({ gauge_percent_two: (this.state.gauge_percent_two + 1) % 100 });
    }, 200);

    setInterval(() => {
      const data = servers.map(() => Math.round(Math.random()*10));
      this.setState({barData: {titles: servers, data }});
    }, 2000);

    setInterval(() => {
      this.setState({tableData: generateTable() });
    }, 3000);

    const log = this.refs.log;
    setInterval(function() {
       var rnd = Math.round(Math.random()*2)
       if (rnd==0) log.log('starting process ' + commands[Math.round(Math.random()*(commands.length-1))])
       else if (rnd==1) log.log('terminating server ' + servers[Math.round(Math.random()*(servers.length-1))])
       else if (rnd==2) log.log('avg. wait time ' + Math.random().toFixed(2))
       screen.render()
    }, 500);

    const sparkline = this.refs.sparkline;
    //set spark dummy data
    var spark1 = [1,2,5,2,1,5,1,2,5,2,1,5,4,4,5,4,1,5,1,2,5,2,1,5,1,2,5,2,1,5,1,2,5,2,1,5]
    var spark2 = [4,4,5,4,1,5,1,2,5,2,1,5,4,4,5,4,1,5,1,2,5,2,1,5,1,2,5,2,1,5,1,2,5,2,1,5]
    refreshSpark()
    setInterval(refreshSpark, 1000)
    function refreshSpark() {
      spark1.shift()
      spark1.push(Math.random()*5+1)
      spark2.shift()
      spark2.push(Math.random()*5+1)
      sparkline.setData(['Server1', 'Server2'], [spark1, spark2])
    }

    //set map dummy markers
    const map = this.refs.map;
    var marker = true
    setInterval(function() {
       if (marker) {
        map.addMarker({"lon" : "-79.0000", "lat" : "37.5000", color: 'yellow', char: 'X' })
        map.addMarker({"lon" : "-122.6819", "lat" : "45.5200" })
        map.addMarker({"lon" : "-6.2597", "lat" : "53.3478" })
        map.addMarker({"lon" : "103.8000", "lat" : "1.3000" })
       }
       else {
        map.clearMarkers()
       }
       marker =! marker
       screen.render()
    }, 1000)

    setInterval(() => {
      this.setState({ transactionsLineData: getLineData([transactionsData, transactionsData1]) });
    }, 500);

    setInterval(() => {
      this.setState({ errorsLineData: getLineData([errorsData]) });
   }, 1500);

   const lcdLineOne = this.refs.lcdLineOne;
   setInterval(() => {
     this.setState({ lcdValue: Math.round(Math.random() * 100) });
     lcdLineOne.setDisplay(this.state.lcdValue + lcdText[this.state.lcdValue % 12]);
     lcdLineOne.setOptions({
       color: lcdColors[this.state.lcdValue % 5],
       elementPadding: 4
     });
     screen.render();
   }, 1500);

    setInterval(() => {
      this.setState({ donutPct: this.state.donutPct + 0.01 });
   }, 500);

    this.refs.table.focus();
  }

  render() {
    return (
      <Grid rows={12} cols={12}>
        <Donut row={8} col={8} rowSpan={4} colSpan={2} {...{ label: 'Percent Donut', radius: 16, arcWidth: 4, yPadding: 2, data: updateDonut(this.state.donutPct) }}/>
        <Gauge row={8} col={10} rowSpan={2} colSpan={2} {...{label: 'Storage', percent: [80,20]}} data={[
          this.state.gauge_percent, 100 - this.state.gauge_percent
        ]}/>
        <Gauge row={2} col={9} rowSpan={2} colSpan={3} {...{label: 'Deployment Progress', percent: 80}} data={this.state.gauge_percent_two}/>
        <Sparkline ref="sparkline" row={10} col={10} rowSpan={2} colSpan={2} {...{ label: 'Throughput (bits/sec)' , tags: true , style: { fg: 'blue', titleFg: 'white' }}}/>
        <Bar row={4} col={6} rowSpan={4} colSpan={3} {...{ label: 'Server Utilization (%)' , barWidth: 4 , barSpacing: 6 , xOffset: 2 , maxHeight: 9}} data={this.state.barData}/>
        <Table ref="table" row={4} col={9} rowSpan={4} colSpan={3} {...{ keys: true , fg: 'green' , label: 'Active Processes' , columnSpacing: 1 , columnWidth: [24, 10, 10]}} data={this.state.tableData}/>
        <Lcd ref="lcdLineOne" row={0} col={9} rowSpan={2} colSpan={3} {...{ label: "LCD Test", segmentWidth: 0.06, segmentInterval: 0.11, strokeWidth: 0.1, elements: 5, color: lcdColors[this.state.lcdValue], display: this.state.lcdValue + lcdText[this.state.lcdValue % 12], elementSpacing: 4, elementPadding: 4 }}/>
        <Line row={0} col={6} rowSpan={4} colSpan={3} {...{ style: { line: "red" , text: "white" , baseline: "black"} , label: 'Errors Rate' , maxY: 60 , showLegend: true }} data={this.state.errorsLineData}/>
        <Line row={0} col={0} rowSpan={6} colSpan={6} {...{ showNthLabel: 5 , maxY: 100 , label: 'Total Transactions' , showLegend: true , legend: {width: 10}}} data={this.state.transactionsLineData}/>
        <Map ref="map" row={6} col={0} rowSpan={6} colSpan={6} label="Servers Location"/>
        <Log ref="log" row={8} col={6} rowSpan={4} colSpan={2} {...{ fg: "green" , selectedFg: "green" , label: 'Server Log'}}/>
      </Grid>
    );
  }
}

var screen = blessed.screen()
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});
render(<App />, screen);
