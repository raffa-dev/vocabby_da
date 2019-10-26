import React from 'react';
import './App.css';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import {enterNode, updateNode} from '../src/D3Functions.js';
import {enterLink, updateLink} from '../src/D3Functions.js';
import {updateGraph} from '../src/D3Functions.js'


const width = 1080;
const height = 250;

export class Graph extends React.Component {
    componentDidMount() {
  this.d3Graph = d3.select(ReactDOM.findDOMNode(this));

  var force = d3.forceSimulation(this.props.data.nodes)
    .force("charge", d3.forceManyBody().strength(-50))
    .force("link", d3.forceLink(this.props.data.links).distance(90))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .force("collide", d3.forceCollide([5]).iterations([5]))

  function dragStarted(d) {
      if (!d3.event.active) force.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y

  }

  function dragging(d) {
      d.fx = d3.event.x
      d.fy = d3.event.y
  }

  function dragEnded(d) {
      if (!d3.event.active) force.alphaTarget(0)
      d.fx = null
      d.fy = null
  }

  const node = d3.selectAll('g.node')
    .call(d3.drag()
              .on("start", dragStarted)
              .on("drag", dragging)
              .on("end", dragEnded)
         );

    force.on('tick', () => {
        this.d3Graph.call(updateGraph)
    });
	}

componentDidUpdate() {
  this.componentDidMount();
//  this.d3Graph = d3.select(ReactDOM.findDOMNode(this));
//
//  var force = d3.forceSimulation(this.props.data.nodes)
//    .force("charge", d3.forceManyBody().strength(-50))
//    .force("link", d3.forceLink(this.props.data.links).distance(90))
//    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
//    .force("collide", d3.forceCollide([5]).iterations([5]))
//
//  function dragStarted(d) {
//      if (!d3.event.active) force.alphaTarget(0.3).restart()
//      d.fx = d.x
//      d.fy = d.y
//
//  }
//
//  function dragging(d) {
//      d.fx = d3.event.x
//      d.fy = d3.event.y
//  }
//
//  function dragEnded(d) {
//      if (!d3.event.active) force.alphaTarget(0)
//      d.fx = null
//      d.fy = null
//  }
//
//  const node = d3.selectAll('g.node')
//    .call(d3.drag()
//              .on("start", dragStarted)
//              .on("drag", dragging)
//              .on("end", dragEnded)
//         );
//
//    force.on('tick', () => {
//        this.d3Graph.call(updateGraph)
//    });
	} 

			render() {
        var nodes = this.props.data.nodes.map( (node) => {
        return (
            <Node data={node} name={node.name}	key={node.id}/>);
        });
        var links = this.props.data.links.map( (link,i) => {
            return (
                <Link key={link.target+i}	data={link} />);
        });
        return (
            <svg className="graph" width={width} height={height}>
                <g>
                    {links}
                </g>
                <g>
                    {nodes}
                </g>
            </svg>
        );
    }
}
export default Graph;

class Node extends React.Component {
  componentDidMount() {
      this.d3Node = d3.select(ReactDOM.findDOMNode(this))
          .datum(this.props.data)
          .call(enterNode)
  }

  componentDidUpdate() {
      this.d3Node.datum(this.props.data)
          .call(updateNode)
  }

  handle(e){
      console.log(this.props.data.id + ' been clicked')
  }

  render() {
      return (
          <g className='node'>
              <circle ref="dragMe" onClick={this.handle.bind(this)}/>
              <text>{this.props.data.name}</text>
          </g>
      );
  }
}


class Link extends React.Component {

  componentDidMount() {
      this.d3Link = d3.select(ReactDOM.findDOMNode(this))
          .datum(this.props.data)
          .call(enterLink);
  }

  componentDidUpdate() {
      this.d3Link.datum(this.props.data)
          .call(updateLink);
  }

  render() {
      return (<line className='link' />);
  }
}

