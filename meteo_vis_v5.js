var topology_file = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/topojson/limits_IT_all.topo.json"

var provinces = null

var temp_file = null
var temp_data = null //lista di oggetti con le temperature per provincia

var pre_umid_file= null
var pre_umid_data = null

var rain_file = null
var rain_data = null

var wind_file = null
var wind_data = null

var centroid_map = {}

var flag_colore = "temp";
var flag_over = null;

var temp_legend = {
    color: d3.scaleSequential([-20, 45], d3.interpolateTurbo),
    title: "Temperature"
}

var rain_legend = {
    color: d3.scaleSequentialSqrt([0, 30], d3.interpolateBlues),
    title: "Sum of rain"
}

var wind_intensity_legend = {
    color: d3.scaleSqrt().domain([0,0.3 ,1.6, 3.5, 5.5, 8.0,10.8,13.9,17.2,20.8,24.5,28.5,32.7]).range(["#f0f8ff","Acqua","DeepSkyBlue","RoyalBlue","Chartreuse",,"ForestGreen","DarkGreen",,"DarkOliverGreen","Red","DarkRed","Fucsia","Purple","Black"]),
    title: "Wind intensity"
}

var width = 800,height = 1000;

var svg = d3.select("#svg").append("svg")
            .attr("width", width)
            .attr("height", height);

const zoom = d3.zoom()
      .scaleExtent([1, 5])
      .on('zoom', zoomed);

svg.call(zoom);
var path = null

var g_pressioni = null;
var g_wind =null;
var g_rain = null;

var width_legend = 350;
var height_legend = 100;
var svg_legende = null;

function zoomed() {
    svg.select(".italy")
      .selectAll('path') // To prevent stroke width from scaling
      .attr('transform', d3.event.transform);
    svg.select(".pressioni")
      .selectAll(".p") // To prevent stroke width from scaling
      .attr("transform", d3.event.transform);
    svg.select(".wind") // To prevent stroke width from scaling
      .attr("transform", d3.event.transform);
  }

function getCentroid(data,path){
    return (path.centroid)(data); 
}

function fill_centroid_map(){
    for(row of provinces.features){
        centroid_map[row.properties.prov_acr] = getCentroid(row,path)
        if(row.properties.prov_acr == "VC")
        {
            centroid_map[row.properties.prov_acr][1] += 12
        }
    }
}

async function init(){
    await draw_map();
    fill_centroid_map(); 
    svg_legende = d3.select("#legende").append("svg")
        .attr("width", width_legend)
        .attr("height", height_legend)
        .attr("viewBox", [0, 0, width_legend, height_legend])
        .style("overflow", "visible")
        .style("display", "block");   
    
    draw_temp();
    
    g_pressioni = svg.append("g").attr("class","pressioni");

    g_wind = svg.append("g").attr("class","wind");

    //draw_wind();

    g_rain = svg.append("g").attr("class","rain")
    
    //draw_rain()
}
init();