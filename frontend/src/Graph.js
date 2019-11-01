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
			viewBox: "100, 100, 230, 200"
		}
		this.click = this.click.bind(this)
	}

	click (selection) {
		var x, y, dx, dy;
		x = selection.x ;
		y = selection.y ;
		console.log(x);
		console.log(y);
    console.log(x.toString() + ',' +  y.toString() + ', 200, 200');
		this.setState({viewBox: x.toString() + ',' +  y.toString() + ', 100, 100'});
	}
  componentDidMount() {

  this.d3Graph = d3.select(ReactDOM.findDOMNode(this));
	var active = d3.select(null);

  var force = d3.forceSimulation(this.props.data.nodes)
    .force("charge", d3.forceManyBody().strength(-50))
    .force("link", d3.forceLink(this.props.data.links).distance(90))
    .force("center", d3.forceCenter().x(width / 2).y(height / 2));
    //.force("collide", d3.forceCollide([5]).iterations([5]))

	var zoom = d3.zoom()
	    .scaleExtent([1, 8])
	    .on("zoom", zoomed);

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

	function zoomed() {
  console.log(d3.event)
  d3.select(this).style("stroke-width", 1.5 / d3.event.scale + "px");
  d3.select(this).attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}   

 function mouseover(selection) {
    d3.select(this).select("circle").transition()
        .duration(250)
        .attr("r", 10);
    d3.select(this).select("text").transition()
    		.duration(250)
        .attr("x", 10)
        .style("stroke-width", ".5px")
        .style("fill", "#E34A33")
        .style("font-size", "17.5px");
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

//	function reset() {
//	  active.classed("active", false);
//	  active = d3.select(null);
//	
//	  svg.transition()
//	      .duration(750)
//	      .call(zoom.translate([0, 0]).scale(1).event);
//	}
//
//	function clicked(d){
//	  if (active.node() === this) return reset();
//	  active.classed("active", false);
//	  active = d3.select(this).classed("active", true);
//	
//	  var bbox = active.node().getBBox(),
//	      bounds = [[bbox.x, bbox.y],[bbox.x + bbox.width, bbox.y + bbox.height]]; //<-- the bounds from getBBox
//	
//	  var dx = bounds[1][0] - bounds[0][0],
//	      dy = bounds[1][1] - bounds[0][1],
//	      x = (bounds[0][0] + bounds[1][0]) / 2,
//	      y = (bounds[0][1] + bounds[1][1]) / 2,
//	      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
//	      translate = [width / 2 - scale * x, height / 2 - scale * y];
//	
//	  svg.transition()
//	      .duration(750)
//	      .call(zoom.translate(translate).scale(scale).event);
//	} 

	function clicked(d) {

    if (active.node() === this){
      active.classed("active", false);
      return reset();
    }
    
    active = d3.select(this).classed("active", true);

    svg.transition()
      .duration(750)
      .call(zoom.transform,
        d3.zoomIdentity
        .translate(width / 2, height / 2)
        .scale(8)
        .translate(-(+active.attr('cx')), -(+active.attr('cy')))
      );
  }

  function reset() {
    svg.transition()
      .duration(750)
      .call(zoom.transform,
        d3.zoomIdentity
        .translate(0, 0)
        .scale(1)
      );
  }

//  function zoomed() {
//    g.attr("transform", d3.event.transform);
//  }

  const node = d3.selectAll('g.node')
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
		//.on("click", this.click)
		.on("click", clicked)
    .call(d3.drag()
              .on("start", dragStarted)
              .on("drag", dragging)
              .on("end", dragEnded)
         );

	const svg = d3.select(".graph");
//		.call(zoom)
//		.call(zoom.event);

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
            <svg className="graph" width={width} height={height} viewBox={this.viewBox} >
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

