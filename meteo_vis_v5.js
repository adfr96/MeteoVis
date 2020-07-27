var topology_file = "https://raw.githubusercontent.com/openpolis/geojson-italy/master/topojson/limits_IT_all.topo.json"

var meteo_file = null
var meteo_data = null
var provinces = null
var pre_umid_file= null
var pre_umid_data = null
var centroid_map = {}

var width = 1000,height = 1000;

var svg = d3.select("#svg").append("svg")
            .attr("width", width)
            .attr("height", height);
/*call(d3.zoom().on("zoom", function () {
    main_g.attr("transform", d3.event.transform)
     }));
*/
var path = null
var g_pressioni = null;

function draw_map(){
    d3.json(topology_file).then( function(topology) {
        
        console.log("topojson", topology)
        

        var projection = d3.geoAlbers()
        .center([-12, 41])
        .rotate([-15, 0])
        .parallels([20, 40])
        .scale(3500)
        .translate([0, height/2]);

        
        path = d3.geoPath().projection(projection);

        provinces = topojson.feature(topology, topology.objects.provinces);
        var municipalities = topojson.feature(topology,topology.objects.municipalities)
        var regions = topojson.feature(topology,topology.objects.regions)
        console.log("provinces", provinces)
        console.log("municipalities", municipalities)

        svg.append("g")
        .attr("class","italy")
        .selectAll("path")
        .data(provinces.features)
        .enter()
        .append("path")
        .attr("d",path)
        .attr("c",path.centroid)
        .attr("class",function(d){return d.properties.prov_acr})
        .on("mouseover",handleMouseOverProvinces)
        .on("mouseout",handleMouseOutProvinces);
        
        draw_temp();

        g_pressioni = svg.append("g").attr("class","pressioni");
        draw_temp();
        //draw_circle(svg,path);
        draw_pressure();

        fill_centroif_map();
        });
}

function draw_temp(){
    new_file = "DATA/temp_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    if(new_file == meteo_file)
    {
        update_temperature(meteo_data);
    }
    else
    {
        //console.log("update_file",new_file)
        meteo_file = new_file
        d3.json(meteo_file).then(function(meteo) {
            meteo_data = meteo
            update_temperature(meteo_data);      
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
function handleMouseOverProvinces(d,i){
    value = parseFloat(this.getAttribute("media_temp")).toFixed(2)
    x = d3.mouse(this)[0]
    y = d3.mouse(this)[1]
    svg.append("text")
        .attr("class","value")
        .attr("transform", "translate("+x+"," + y+ ")")
        .text("province:"+this.className.baseVal+"\n media_temp:"+value)
}
function handleMouseOutProvinces(d,i){
    svg.select(".value").remove();
}

function draw_circle(prov){
    if(centroid_map[prov] != undefined)
    {
        g_pressioni.append("circle")
        .attr("cx",centroid_map[prov][0])
        .attr("cy",centroid_map[prov][1])
        .attr("r",3)
        .attr("stroke","gray")
        .attr("stroke-width",1.5)
        .style("fill","gray");
    }
    else{console.log(prov)}
}
function draw_square(prov){
    if(centroid_map[prov] != undefined)
    {
        g_pressioni.append("rect")
            .attr("x", centroid_map[prov][0])
            .attr("y", centroid_map[prov][1])
            .attr("width", 5)
            .attr("height", 5)
            .attr("stroke","gray")
            .attr("stroke-width",1.5)
            .style("fill","gray");
    }
    else{
        console.log(prov)
    }
}

function getCentroid(data,path){
    return (path.centroid)(data) ;
    
}

function draw_pressure(){
    new_file = "DATA/pre_umid_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    if(new_file == pre_umid_file)
    {
        update_pressure(pre_umid_data);
    }
    else
    {
        //console.log("update_file",new_file)
        pre_umid_file = new_file
        d3.json(pre_umid_file).then(function(pre_umid) {
            pre_umid_data = pre_umid
            update_pressure(pre_umid_data);        
        });
    }
}

function update_pressure(){
    g_pressioni.selectAll("circle").remove();
    g_pressioni.selectAll("rect").remove();
    for(row of pre_umid_data)
    {   
        if(row.provincia != "nan" && row.ora==ora.value)
        {
            //console.log(row.pressione_media)
            if(row.pressione_media > 1013)
            {
                draw_circle(row.provincia);
            }
            else{
                draw_square(row.provincia);
            }
        }
    }
}

function fill_centroif_map(){
    for(row of provinces.features){
        centroid_map[row.properties.prov_acr] = getCentroid(row,path)
    }
    console.log(centroid_map)
}

function update_all(){
    draw_temp();
    draw_pressure();
}

function init(){
    
    draw_map();
    draw_temp();    
}
init();