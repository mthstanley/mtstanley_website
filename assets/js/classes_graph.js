// width and height
var target = d3.select("#class_graph");
var box = target.node().getBoundingClientRect();
var w = box.width;
var h = box.height;

// data
var dataset = {
        nodes: [
                { className: "CS 150", level: 1, title: "Computing for the Sciences" },
                { className: "CS 200", level: 2, title: "Math Foundations of Computing" },
                { className: "CS 201", level: 2, title: "Data Structures" },
                { className: "CS 202", level: 2, title: "Computer Architecture" },
                { className: "CS 301", level: 3, title: "Theory of Computation" },
                { className: "CS 302", level: 3, title: "Algorithms and Complexity" },
                { className: "CS 311", level: 3, title: "Artificial Intelligence" },
                { className: "CS 312", level: 3, title: "Software Development" },
                { className: "CS 313", level: 3, title: "Programming Languages" },
                { className: "CS 390", level: 3, title: "Spatial Agent-Based Modeling" },
                { className: "CS 431", level: 4, title: "Computer Networks" },
                { className: "CS 461", level: 4, title: "Computer Graphics" },
                { className: "CS 463", level: 4, title: "Cryptograpy" },
		{ className: "CS 1005", level: 5, title: "Crash Course in Systems Security"}  
        ],
        edges: [
            { source: 0, target: 1 },
            { source: 0, target: 2 },
            { source: 2, target: 3 },
            { source: 1, target: 4 },
            { source: 2, target: 4 },
            { source: 1, target: 5 },
            { source: 2, target: 5 },
            { source: 1, target: 6 },
            { source: 2, target: 6 },
            { source: 1, target: 7 },
            { source: 2, target: 7 },
            { source: 1, target: 8 },
            { source: 3, target: 8 }, 
            { source: 2, target: 9 },
            { source: 1, target: 10 },
            { source: 3, target: 10 },
            { source: 1, target: 11 },
            { source: 3, target: 11 },
            { source: 4, target: 12 },
            { source: 5, target: 12 },
	    { source: 3, target: 13}
        ]
};

var nodeRadius = 10;

dataset.nodes.forEach(function(d) {
    d.preReqs = [];   
})

var force = d3.layout.force()
                        .nodes(dataset.nodes)
                        .links(dataset.edges)
                        .size([w, h])
                        .linkDistance([80])
                        .gravity(0.2)
                        .charge([-500])
                        .start();

var colors = d3.scale.category20();

// create svg element
var svg = d3.select("#class_graph")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// create edges as lines
var edges = svg.selectAll(".edge")
                .data(dataset.edges)
                .enter()
                .append("line")
                .attr("class", "edge");

// create nodes as circles
var nodes = svg.selectAll(".node")
                .data(dataset.nodes)
                .enter()
                .append("g")
                .attr("class", "node")
                .call(force.drag);


dataset.edges.forEach(function(d) {
    var source = d.source;
    var target = d.target;
    if(target.preReqs.indexOf(source.index) == -1){
        target.preReqs.push(source.index);
    }
})



nodes.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", nodeRadius)
    .attr("id", function(d) { return "name" + d.index; })
    .style("fill", function(d, i) {
        return colors(d.level);
    })

// labels 
nodes.append("text")
        .attr("text-anchor", "middle")
        .attr()
        .text(function(d) {
            return d.className
        });


nodes.on("mouseover", function(d){
        
    

    // Get this bar's x/y values, then augment for the tooltip
    var xPosition = d3.event.pageX + nodeRadius;
    var yPosition = d3.event.pageY + nodeRadius;

    // update the tooltip position and value
    d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")
            .select("#title")
            .text(d.title);
    
    var pre_req_text = "";

    d.preReqs.forEach(function(r) {
        pre_req_text += dataset.nodes[r].className + " | ";
        d3.select("#name" + r)
        .transition()
        .duration(500)
        .attr("r", nodeRadius+5)
        .style("fill", "teal");
    })

    d3.select("#tooltip")
        .select("#pre_reqs")
        .text(pre_req_text.substring(0, pre_req_text.length - 2));
    // Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
})
.on("mouseout", function(d) {
    // hide the tooltip
    d3.select("#tooltip").classed("hidden", true);
    d.preReqs.forEach(function(r) {
        d3.select("#name" + r)
        .transition()
        .duration(500)
        .attr("r", nodeRadius)
        .style("fill", function(d, i) {
            return colors(d.level)
        });
    });
});

d3.select(window).on("resize", function(){
    // width and height
    var target = d3.select("#class_graph");
    var box = target.node().getBoundingClientRect();
    var w = box.width;
    var h = box.height;
    
    svg.attr("width", w)
        .attr("height", h);
    
    force.size([w, h]).resume();
});

force.on("tick", function() {

    edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

    nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

});
