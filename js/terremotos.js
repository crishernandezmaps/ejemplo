function drawChart(data) {

  // Number of cluster calculation
  var coun = []
  for (var i = 0; i < data.length; i++) {
    coun.push(data[i].country);
  }
  var uniqueItems = Array.from(new Set(coun))
  console.log(uniqueItems);

  var width = 900,
      height = 550,
      padding = 2, // separation between same-color circles
      clusterPadding = 3, // separation between different-color circles
      maxRadius = 12;

  var n = data.length, // nodes
      m = uniqueItems.length, // clusters
      clusters = new Array(m);

  var pallete = ["#ffc60c", "#cc5810", "#558930", "#1f86cc", "#7f3e98", "#717770", "#c68642", "#71d6e7", "#f3800d"];
  var color = d3.scaleOrdinal(pallete);

  // CREDITS: Thanks pmia2 http://blockbuilder.org/pmia2/028815204d5e30fd221355a8e3b46c1e
  var nodes = data.map((d) => {
    var i = d.cluster, // it has to be a numeric variable. In this case, a number per Region.
        r = maxRadius,
        d = {
          cluster: i,
          radius: r,
          date: d.date,
          country: d.country,
          year: d.year,
          place: d.place,
          magnitude: d.magnitude,
          numero: d.numero,
          x: Math.cos(i / m * 2 * Math.PI) * 100 + width / 2 + Math.random(),
          y: Math.sin(i / m * 2 * Math.PI) * 100 + height / 2 + Math.random()
        };
        if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
        return d;
  });

  var simulation = d3.forceSimulation()
    .force('center', d3.forceCenter(width/2, height/2.5)) // keep entire simulation balanced around screen center
    .force('cluster', d3.forceCluster().centers(function (d) { return clusters[d.cluster]; }).strength(0.5).centerInertia(0.1)) // cluster by section
    .force('collide', d3.forceCollide(function (d) { return d.radius + padding; })) // apply collision with padding
    .on('tick', layoutTick)
    .nodes(nodes);

  var svg = d3.select('#bubbles')
    .append('svg')
    .attr('class', 'bubls')
    .attr("width", '100%')
    .attr("height", '100%')
    .attr('viewBox','0 0 '+Math.min(width)+' '+Math.min(height))
    .attr("preserveAspectRatio", "xMinYMin meet");

  // Tool_tip //
  var content = function(d) {
    return "<span class='ngrupo'>" + d.country + "</span>" + "<br>"
          +"<span class='ngrupo'>" + d.place + "</span>" + "<br>"
          +"<span class='ngrupo'>" + d.year + "</span>" + "<br>"
          +"<spanclass='ngrupo'>" + d.magnitude + "</span>"
          +"<p class='ngrupo'>Lugar: " + d.place + "</p>";
  }

  var tool_tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(content);

  svg.call(tool_tip);

  var hide = function(d) {
      d3.select("#hidden").html('<h4>Grupo de Investigación: '+ d.magnitude +'</h4>')}

  var node = svg.selectAll('circle')
    .data(nodes)
    .enter()
    .append('circle')
      .attr('class', 'nodo')
      .attr('r', function (d) { return d.radius; })
      .attr('fill', function (d) { return color(d.cluster/m) })
      .on('click',hide)
      .on('mouseover', tool_tip.show)
      .on('mouseout', tool_tip.hide);

  node.transition()
    .duration(700)
    .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

  function layoutTick (e) {
    node
      .attr('cx', function (d) { return d.x; })
      .attr('cy', function (d) { return d.y; })
  }

    var pallete = ["#F4C2C2", "#FF6961", "#FF5C5C", "#FF1C00", "#FF0800", "#FF0000", "#CD5C5C", "#E34234", "#D73B3E","#CE1620","#CC0000","#B22222","#B31B1B","#A40000","#800000","#701C1C","#3C1414","#321414"];
    var color2 = d3.scaleOrdinal(pallete);

  // Capacidades //////////////////////////////////////
  var mayorIguala60 = 650;
  var menorA60 = 400;

  d3.select("#year").on('click',function(){
    simulation
    .force("y", d3.forceY(function(d){
      if(Number(d.year) > 1960){
        return mayorIguala60 } else {
          return menorA60 }
    }).strength(0.5))
    .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
    .alphaTarget(0.1)
    .restart();
    // node
    // .attr('r', function(d) {return Number(d.numero)-100;})
  })

  d3.select("#magnitud").on('click',function(){
    simulation
    .force('center', d3.forceCenter(width/2, height/2.3))
    .force("y", d3.forceY(function(d){
      if(Number(d.magnitude) >= 9){
        return 460 } else {
          return 650 }
    }).strength(0.5))
    .force('x',d3.forceX(function() { return width/2 }).strength(0.1).x(width * .5))
    .alphaTarget(0.1)
    .restart();
  })


}; ////////////////////////////////// D3 - END //////////////////////////////////

////////////////////////////////// Tabletop //////////////////////////////////
var link = 'https://docs.google.com/a/crishernandez.co/spreadsheets/d/1XRa3GFloRymR3TeFpCK1MZDvMqhXEQ1vXFQWliusJhc/edit?usp=sharing'
var terremotos = '1XRa3GFloRymR3TeFpCK1MZDvMqhXEQ1vXFQWliusJhc'
var options = { key: terremotos, simpleSheet: true, callback: draw }
function renderSpreadsheetData() { Tabletop.init(options) }
function draw(data, tabletop) { drawChart(data) }
renderSpreadsheetData();
////////////////////////////////// Tabletop - END//////////////////////////////////
