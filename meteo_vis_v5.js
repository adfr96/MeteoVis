//var url = '../geojson-italy/topojson/limits_IT_provinces.topo.json'
var topology_file = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/topojson/limits_IT_all.topo.json"
//var meteo_file = "https://github.com/adfr96/MeteoVis/blob/master/dati_meteo.json"
//var meteo_file = "dati_meteo.json"
var width = 800,height = 800;

var meteo_file = null
var meteo_data = null
//console.log(meteo_file)

var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height).call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform)
             }));


function draw_map(){
    d3.json(topology_file).then( function(topology) {
        
        console.log("topojson", topology)
        

        var projection = d3.geoAlbers()
        .center([-12, 41])
        .rotate([-15, 0])
        .parallels([20, 40])
        .scale(3000)
        .translate([0, height/2]);

        
        var path = d3.geoPath().projection(projection);

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
        
        draw_temp();
        });
}

function draw_temp(){
    new_file = "TEMPERATURE/temp_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    if(new_file == meteo_file)
    {
        update_temperature(meteo_data) 
    }
    else
    {
        //console.log("update_file",new_file)
        meteo_file = new_file
        d3.json(meteo_file).then(function(meteo) {
            meteo_data = meteo
            update_temperature(meteo_data)        
        });
}
}

function update_temperature(meteo_data){
    for(row of meteo_data)
        {   
            if(row.provincia != "" && row.ora==ora.value)
            {
                //console.log(row.provincia,row.media_temp)
                p = svg.select("."+row.provincia)
                    .attr("media_temp",row.media_temp)
                    .style("fill",temp_to_color(row.media_temp));
            }
        }
}

function temp_to_color(temp){
    //color = d3.scaleSqrt().domain([-30, -15 ,0, 15, 30, 45]).range(["navy","blu","acqua", "greenyellow", "orange","purple"])
    color = d3.scaleSequential([-20, 45], d3.interpolateTurbo);
    return color(temp)
}

function init(){
    
    draw_map();
    
    draw_temp();
}
init();