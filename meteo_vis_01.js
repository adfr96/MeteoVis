
//var url = '../geojson-italy/topojson/limits_IT_provinces.topo.json'
var topology_file = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/topojson/limits_IT_all.topo.json"
//var meteo_file = "https://github.com/adfr96/MeteoVis/blob/master/dati_meteo.json"
//var meteo_file = "dati_meteo.json"

//var anno = document.getElementById("anno").value;
//var mese = document.getElementById("mese").value;
//var giorno = document.getElementById("giorno").value;
//var ora = document.getElementById("ora").value;
var meteo_file = "TEMPERATURE/temp_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"

console.log(meteo_file)

var width = 1200,height = 800;


var svg = d3.select("body").append("svg")
            .attr("width", width)
            .attr("height", height);

function draw_map(){
    d3.json(topology_file, function(error, topology) {
        if (error) throw error;
        console.log("topojson", topology)
        

        var projection = d3.geo.albers()
        .center([-12, 41])
        .rotate([-15, 0])
        .parallels([20, 40])
        .scale(3000)
        .translate([0, height/2]);

        
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
        
        draw_temp();
        });
}

function draw_temp(){
    d3.json(meteo_file, function(error, meteo) {
        if (error) throw error;
        
        
        console.log(ora)
        
        for(row of meteo)
        {   
            if(row['provincia'] != "" && row['ora']==ora.value)
            {
                //console.log(row.provincia,row.media_temp)
                p = svg.select("."+row.provincia).style("fill",temp_to_color(row.media_temp));
            }
        }
    });
}

function temp_to_color(temp){
    //temp = temp-30
    //color =  d3.scaleSqrt([-100, 0, 100], ["blue", "white", "red"])
    color = d3.scale.sqrt().domain([-20, 0, 20, 40]).range(["blue","green", "yellow", "red"])
    //console.log(color(temp))
    return color(temp)
}

function init(){
    draw_map();
    draw_temp();
}
init();