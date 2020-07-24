//var url = '../geojson-italy/topojson/limits_IT_provinces.topo.json'
var url = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/topojson/limits_IT_all.topo.json"



d3.json(url, function(error, topology) {
    if (error) throw error;
    console.log("topojson", topology)
    var width = 1200,
    height = 800;

    var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

    var projection = d3.geo.albers()
    .center([-12, 41])
    .rotate([-15, 0])
    .parallels([20, 40])
    .scale(3000)
    .translate([0, height/2]);

    //.translate([width/8, height*7/2])
    var path = d3.geo.path().projection(projection);


    var provinces = topojson.feature(topology, topology.objects.provinces);
    var municipalities = topojson.feature(topology,topology.objects.municipalities)

    console.log("provinces", provinces)
    console.log("municipalities", municipalities)

    svg.append("g")
    .attr("class","italy")
    .selectAll("path")
    .data(provinces.features)
    .enter()
    .append("path")
    .attr("d",path)
    .attr("class",function(d){return d.properties.prov_acr});

    torino = svg.selectAll(".TO").attr("fill","yellow");
    console.log(torino);

    //italy.attr("transform", "translate(-500,2600)");
    
});