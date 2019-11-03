import React from 'react';
import './App.css';
import * as d3 from 'd3';
import ReactDOM from 'react-dom';
import {enterNode, updateNode} from '../src/D3Functions.js';
import {enterLink, updateLink} from '../src/D3Functions.js';
import {updateGraph} from '../src/D3Functions.js'
// import {updateGraph, mouseover, mouseout} from '../src/D3Functions.js'

const width = 960;
const height = 480;

export class Graph extends React.Component {

  constructor(props) {
  	super(props);
		this.state = {
			viewBox: "100, 100, 3030, 3000"
		}
	}

  componentDidMount() {

  this.d3Graph = d3.select(ReactDOM.findDOMNode(this));
	var active = d3.select(null);

  var force = d3.forceSimulation(this.props.data.nodes)
    .force("charge", d3.forceManyBody().strength(-50))
    .force("link", d3.forceLink(this.props.data.links).distance(90))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .force("collide", d3.forceCollide([5]).iterations([5]));

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

 function mouseover(selection) {
    d3.select(this).select("circle").transition()
        .duration(250)
        .attr("r", 30)
        .style("background-color", 'orange');
    d3.select(this).select("text").transition()
    		.duration(250)
        .attr("x", 30)
        .style("stroke-width", ".5px")
        .style("fill", "#E34A33")
        .style("font-size", "64px");
} 

 function mouseout() {
    d3.select(this).select("circle").transition()
        .duration(250)
        .attr("r", 5);
    d3.select(this).select("text").transition()
    		.duration(250)   
        .attr("x", 5)
    		.attr("dy", ".35em")
				.style("fill", "black")
        .style("font-size", '15px');
	}


function zoomed() {
    d3.select('g.canvas').attr("transform", d3.event.transform);
}

var zoom = d3.zoom()
    .scaleExtent([1 / 2, 10])
    .on("zoom", zoomed);

d3.select('g.canvas').call(zoom);

  var centered;

	function clicked(d) {
	  var x, y, k;
	
	  if (d && centered !== d) {
	    // var centroid = node.centroid(d);
			console.log(d.x)
	    x = d.x ; // centroid[0];
	    y = d.y ; // centroid[1];
	    k = 6;
	    centered = d;
	  } else {
	    x = width / 2;
	    y = height / 2;
	    k = 1;
	    centered = null;
	  }
	
	  d3.selectAll('g.canvas').selectAll("g.node")
	      .classed("circleActive", centered && function(d) { return d === centered; });
	
		d3.selectAll('g.canvas').transition()
	      .duration(750)
	      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
	      .style("stroke-width", 1.5 / k + "px");
	}

  const node = d3.selectAll('g.node')
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
		//.on("click", this.click)
		.on("click", clicked)
    .call(d3.drag()
              .on("start", dragStarted)
              .on("drag", dragging)
              .on("end", dragEnded));

    force.on('tick', () => {
        this.d3Graph.call(updateGraph)
    });
	}

// componentDidUpdate() {
//  this.componentDidMount();
//	} 

			render() {
        var nodes = this.props.data.nodes.map( (node) => {
        return (
            <Node data={node} name={node.name} key={node.id} />);
        });
        var links = this.props.data.links.map( (link,i) => {
            return (
                <Link key={link.target+i}	data={link} />);
        });
        return (
            <svg className="graph" width={width} height={height} viewBox="-1500, -1500, 3000, 3000" >
                <g className="canvas">
                    {links}
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

