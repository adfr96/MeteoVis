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

var g_wind =null;
var g_rain = null;
var g_pressioni = null;

var centroid_map = {}

var temp_legend = {
    color: d3.scaleSequential([-20, 45], d3.interpolateTurbo),
    title: "Temperature"
}

var rain_legend = {
    color: d3.scaleSequentialSqrt([0, 30], d3.interpolateBlues),
    title: "Sum of rain"
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
  }
function draw_map(){
    return d3.json(topology_file).then( function(topology) {       

        var projection = d3.geoAlbers()
        .center([-12, 41])
        .rotate([-15, 0])
        .parallels([20, 40])
        .scale(3500)
        .translate([0, height/(2.5)]);

        
        path = d3.geoPath().projection(projection);

        provinces = topojson.feature(topology, topology.objects.provinces);
        var municipalities = topojson.feature(topology,topology.objects.municipalities)
        var regions = topojson.feature(topology,topology.objects.regions)

        svg.append("g")
        .attr("class","italy")
        .selectAll("path")
        .data(provinces.features)
        .enter()
        .append("path")
        .attr("d",path)
        .attr("class",function(d){return d.properties.prov_acr})
        .on("mouseover",handleMouseOverProvinces)
        .on("mouseout",handleMouseOutProvinces)
        .on("click",handleMouseClickProvinces);

        });
}

function draw_temp(){
    new_file = "DATA/temp_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    //console.log(temp_file)
    if(new_file == temp_file)
    {
        update_temperature(temp_data);
    }
    else
    {
        //console.log("update_file",new_file)
        temp_file = new_file
        d3.json(temp_file).then(function(meteo) {
            temp_data = meteo
            update_temperature(temp_data);      
        });
    }
    draw_temp_legend();
}

function update_temperature(temp_data){
    for(row of temp_data)
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
    return temp_legend.color(temp)
}
function wind_to_color(wind_speed) {
    color = d3.scaleSqrt().domain([0,0.3 ,1.6, 3.5, 5.5, 8.0,10.8,13.9,17.2,20.8,24.5,28.5,32.7]).range(["AliceBlue","Acqua","DeepSkyBlue","RoyalBlue","Chartreuse",,"ForestGreen","DarkGreen",,"DarkOliverGreen","Red","DarkRed","Fucsia","Purple","Black"])
    //color = d3.scaleSequential([-20, 45], d3.interpolateTurbo);
    return color(wind_speed)   
}
function draw_wind() {
    new_file = "DATA/wind_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    //console.log(wind_file)
    if (new_file == wind_file) {
        update_wind(wind_data);
    }
    else {
        wind_file = new_file
        d3.json(wind_file).then(function(meteo) {
            wind_data = meteo
            update_wind(wind_data);
        });
    }
}

function update_wind(wind_data) {
    remove_wind();
    for(row of wind_data) {
        if(row.provincia != "nan" && row.ora == ora.value) {
            
            p = svg.select("."+row.provincia)
                .attr("wind_speed",row.wind_speed_max)
                .style("fill",wind_to_color(row.wind_speed_max));
            draw_arrow(row.provincia,row.wind_deg_max);
        }
    }
}

function draw_arrow(prov,wind_deg) {
    if(centroid_map[prov] != undefined)
    {
        var x1 = centroid_map[prov][0]
        var y1 = centroid_map[prov][1]
        var x2 = centroid_map[prov][0]+Math.cos(wind_deg)*8
        var y2 = centroid_map[prov][1]+Math.sin(wind_deg)*8
        //console.log("ok "+prov)
            g_wind.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke-width",2)
            .attr("stroke","black")
            .attr("marker-end","url(#arrow)");
            g_wind.append("svg:defs").append("svg:marker")
                .attr("id", "arrow")
                .attr("refX", 0)
                .attr("refY", 3)
                .attr("markerWidth", 8)
                .attr("markerHeight", 6)
                .attr("markerUnits", "userSpaceOnUse")
                .attr("orient", "auto")
                .append("path")
                //.attr("d", "M 0 0 L 4 8 L 8 0")
                .attr("d","M 0 0 L 8 3 L 0 6")
                .style("fill", "black");
    }
    else{
        console.log(prov)
    }   
}

function handleMouseOverProvinces(d,i){
    value = parseFloat(this.getAttribute("media_temp")).toFixed(2)
    id_prov = (this.getAttribute("class"))
    x = d3.mouse(this)[0]
    y = d3.mouse(this)[1]
    svg.append("text")
        .attr("class","value")
        .attr("transform", "translate("+x+"," + y+ ")")
        .text("province:"+id_prov)
}
function handleMouseOutProvinces(d,i){
    svg.select(".value").remove();
}

function draw_circle(prov){
    if(centroid_map[prov] != undefined)
    {
        g_pressioni.append("circle")
        .attr("class","p")
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
            .attr("class","p")
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
    return (path.centroid)(data); 
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
    remove_pressure();
    for(row of pre_umid_data)
    {   
        if(row.provincia != "nan" && row.ora==ora.value)
        {
            // TODO: soglie scelte dall'utente
            
            if(row.pressione_media > 1014)
            {
                draw_circle(row.provincia);
            }
            if(row.pressione_media < 1011){
                draw_square(row.provincia);
            }
        }
    }
}

function remove_pressure(){
    g_pressioni.selectAll("circle").remove();
    g_pressioni.selectAll("rect").remove();
}

function remove_wind() {
    g_wind.selectAll("line").remove();
}

function remove_color(){
    svg.selectAll("path").style("fill","#ccc")
}

function show_pressure(show){
    if(show)
    {
        update_pressure(pre_umid_data);
    }
    else
    {
        remove_pressure();
    }
}

function show_temp(show){
    if(show)
    {
        draw_temp();
    }
    else
    {
        remove_color();
    }
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

function update_all(){
    draw_temp();
    //draw_pressure();
    //draw_wind();
    draw_rain();
}
function remove_legend(){
    svg_legende.select(".legend").remove();
}
function draw_temp_legend(){

    remove_legend();
    console.log("qui")
    svg_legende.append("image")
        .attr("class","legend")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width_legend)
        .attr("height", height_legend)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", "temp_legend.png");   
}

function draw_rain(){
    new_file = "DATA/rain_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    //console.log(rain_file)
    if (new_file == rain_file) {
        update_rain(rain_data);
    }
    else {
        rain_file = new_file
        d3.json(rain_file).then(function(meteo) {
            rain_data = meteo
            update_rain(rain_data);
        });
    }
}

function update_rain(rain_data) {
    remove_pressure();
    for(row of rain_data)
    {   
        if(row.provincia != "nan" && row.ora==ora.value)
        {
            draw_rect(row.provincia,row.sum_rain)
        }
    }
}
function draw_rect(prov,mm_rain) {
    console.log(mm_rain)
    if(centroid_map[prov] != undefined)
    {
        var h = scaleLinearRain(mm_rain)
        g_pressioni.append("rect")
            .attr("class","p")
            .attr("x", centroid_map[prov][0])
            .attr("y", centroid_map[prov][1]-h/2)
            .attr("width", 5)
            .attr("height", h)
            .attr("stroke","gray")
            .attr("stroke-width",1)
            .style("fill","black");
    }
    else{
        console.log(prov)
    }
}
function scaleLinearRain(mm_rain){
    var max = valMax(rain_data,"sum_rain")
    console.log("max: ",max)
    var myscale = d3.scaleLinear().domain([0,max]).range([0,15])
    //console.log("mm_rain: "+mm_rain)
    //console.log("mm_rain scala: "+myscale(mm_rain))
    return myscale(mm_rain)
    
}
function valMax(data,val) {
    var max = 0
    for (row of data) {
        if (row.sum_rain > max && row.ora==ora.value) {
            max = row.sum_rain
        }
    }
    //console.log(max)
    return max
}
function handleMouseClickProvinces(d,i){
    id_prov = (this.getAttribute("class"))
    d3.select("#info_area").select("#province")
        .text("province:"+id_prov);

    d3.select("#info_area").select("#temp")
    .text("temperatura media:"+get_temp_from_data(id_prov));

    d3.select("#info_area").select("#pressure")
    .text("pressione media:"+get_pressure_from_data(id_prov));
}

function get_temp_from_data(prov){
    for(row of temp_data)
    {   
        if(row.provincia == prov && row.ora==ora.value)
        {
            return row.media_temp
        }
    }
}

function get_pressure_from_data(prov){
    for(row of pre_umid_data)
    {   
        if(row.provincia == prov && row.ora==ora.value)
        {
            return row.pressione_media
        }
    }
}

function draw_rain_color(){
    new_file = "DATA/rain_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    

    if(new_file == rain_file)
    {
        update_rain_color(rain_data);
    }
    else
    {
        //console.log("update_rain_file",new_file)
        rain_file = new_file
        d3.json(rain_file).then(function(meteo) {
            rain_data = meteo
            //console.log(rain_data)
            update_rain_color(rain_data);      
        });
    }
    remove_legend()
    draw_rain_color_legend()
}

function update_rain_color(rain_data){
    for(row of rain_data)
    {   
        if(row.provincia != "" && row.ora==ora.value)
        {
            //console.log(row.provincia,row.media_temp)
            p = svg.select("."+row.provincia)
                .attr("sum_rain",row.sum_rain)
                .style("fill",rain_to_color(row.sum_rain));
        }
    }
}

function rain_to_color(sum_rain){
    return rain_legend.color(sum_rain);
}

function show_rain_color(show){
    if(show)
    {
        draw_rain_color()
    }
    else
    {
        remove_color();
    }
}

function draw_rain_color_legend(){

    remove_legend();
    console.log("qui")
    svg_legende.append("image")
        .attr("class","legend")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width_legend)
        .attr("height", height_legend)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", "rain_legend.png");
    
    
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
    
    //draw_pressure();
    
    g_wind = svg.append("g").attr("class","wind");

    //draw_wind();

    g_rain = svg.append("g").attr("class","rain")
    
    draw_rain()
}
init();