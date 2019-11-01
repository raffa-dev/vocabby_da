import * as d3 from 'd3';


export var width = 1080;
export var height = 480;

// const color = d3.scaleOrdinal(d3.schemeCategory10);
var red_zone = d3.scaleLinear().domain([1, 100])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#ffad9e"), d3.rgb('red')]);

var green_zone = d3.scaleLinear().domain([1, 100])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("#9cff77"), d3.rgb('#32bb00')]);

function color(d) {  
	var margin = (d - 0.5);
	if (margin === 0) {
		return "#b7b7b7"
	}
	if (margin > 0) {
		return green_zone(Math.round(margin/0.005))
	} else {
		return red_zone(Math.round(-margin/0.005));
	} 
}


export const enterNode = (selection) => {
    selection.select('circle')
        .attr("r", 5)
        .style("fill", function(d) { return color(d.score) })

    selection.select('text')
        .attr("dy", "0.35em")
        .style("transform", "translateX(-50%,-50%")
				.style("fill", "black")
};

export const updateNode = (selection) => {
    selection.attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")

};

export const enterLink = (selection) => {
    selection.attr("stroke-width", 2)
    .style("stroke","grey")
        .style("opacity", function(x) {return x.weight})
};

export const updateLink = (selection) => {
    selection
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);
};

export const updateGraph = (selection) => {
    selection.selectAll('.node')
        .call(updateNode)
        .call(d3.drag);
    selection.selectAll('.link')
        .call(updateLink);
};
