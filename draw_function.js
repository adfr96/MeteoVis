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

        g_italy = svg.append("g")
            .attr("class","italy");

        g_italy.selectAll("path")
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
                .style("fill",temp_legend.color(row.media_temp));
        }
    }
}

function draw_wind_intensity() {
    new_file = "DATA/wind_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    //console.log(wind_file)
    if (new_file == wind_file) {
        update_wind_intensity(wind_data);
    }
    else {
        wind_file = new_file
        d3.json(wind_file).then(function(meteo) {
            wind_data = meteo
            update_wind_intensity(wind_data);
        });
    }
    draw_wind_color_legend();
}

function update_wind_intensity(wind_data) {
    flag_colore = "wind"
    //console.log(wind_intensity_legend)
    for(row of wind_data) {
        if(row.provincia != "nan" && row.ora == ora.value) {
            
            p = svg.select("."+row.provincia)
                .attr("wind_speed",row.wind_speed_max)
                .style("fill",wind_intensity_legend.color(parseFloat(row.wind_speed_max)) );
        }
    }
}

function update_wind_deg(wind_data) {
    for(row of wind_data) {
        if(row.provincia != "nan" && row.ora == ora.value) {
            if(row.provincia == "CA")
            {
                console.log(row)
            }
            draw_arrow(row.provincia,row.wind_deg_max);
        }
    }
}

function draw_wind_deg() {

    new_file = "DATA/wind_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    if (new_file == wind_file) {
        update_wind_deg(wind_data);
    }
    else {
        wind_file = new_file
        d3.json(wind_file).then(function(meteo) {
            wind_data = meteo
            update_wind_deg(wind_data);
        });
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
            .attr("calss","w")
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

function draw_circle(prov){
    if(centroid_map[prov] != undefined)
    {
        g_pressioni.append("circle")
        .attr("class","p")
        .attr("cx",centroid_map[prov][0])
        .attr("cy",centroid_map[prov][1])
        .attr("r",3)
        .attr("stroke","black")
        .attr("stroke-width",1.5)
        .style("fill","black");
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
            .attr("stroke","black")
            .attr("stroke-width",1.5)
            .style("fill","black");
    }
    else{
        console.log(prov)
    }
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

    for(row of rain_data)
    {   
        if(row.provincia != "nan" && row.ora==ora.value)
        {
            draw_rect(row.provincia,row.sum_rain)
        }
    }
}

function draw_rect(prov,mm_rain) {
    //console.log(mm_rain)
    if(centroid_map[prov] != undefined  && mm_rain != 0)
    {
        var h = scaleLinearRain(mm_rain)
        g_rain.append("rect")
            .attr("class","r")
            .attr("x", centroid_map[prov][0])
            .attr("y", centroid_map[prov][1]-h/2)
            .attr("width", 5)
            .attr("height", h)
            .attr("stroke","black")
            .attr("stroke-width",1)
            .style("fill","black");
    }
    else{
        console.log("province not found:"+prov)
    }
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

function scaleLinearRain(mm_rain){
    var max = valMax(rain_data,"sum_rain")
    //console.log("max: ",max)
    var myscale = d3.scaleLinear().domain([0,max]).range([0,15])
    //console.log("mm_rain: "+mm_rain)
    //console.log("mm_rain scala: "+myscale(mm_rain))
    return myscale(mm_rain)
    
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
    draw_rain_color_legend();
}

function update_rain_color(rain_data){
    flag_colore = "rain"
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

function draw_rain_color_legend(){
    remove_legend();
    svg_legende.append("image")
        .attr("class","legend")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width_legend)
        .attr("height", height_legend)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", "Legends/rain_legend.png");
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
        .attr("xlink:href", "Legends/temp_legend.png");   
}

function draw_wind_color_legend(){
    remove_legend();
    svg_legende.append("image")
        .attr("class","legend")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width_legend)
        .attr("height", height_legend)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", "Legends/wind_legend.png");
}

function draw_pressure_color_legend(){
    remove_legend();
    svg_legende.append("image")
        .attr("class","legend")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width_legend)
        .attr("height", height_legend)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", "Legends/pressure_legend.png");
}

function draw_pressure_legend(){
    svg_p_legend = d3.select("#legenda_pressione").append("svg")
        .attr("width", 200)
        .attr("height", 100)
        .attr("viewBox", [0, 0, 100, 50])
        .style("overflow", "visible")
        .style("display", "block");  
    
    svg_p_legend.append("circle")
    .attr("cx",10)
    .attr("cy",10)
    .attr("r",8)
    .attr("stroke","black")
    .attr("stroke-width",1.5)
    .style("fill","black");

    svg_p_legend.append("text")
            .attr("transform", "translate(25,15)")
            .text("High Pressure (>1014 hPa)")
            .style("font","italic 10px sans-serif");

    svg_p_legend.append("rect")
            .attr("class","p")
            .attr("x", 2)
            .attr("y", 25)
            .attr("width", 15)
            .attr("height", 15)
            .attr("stroke","black")
            .attr("stroke-width",1.5)
            .style("fill","black");
    
    svg_p_legend.append("text")
            .attr("transform", "translate(25,40)")
            .text("Low Pressure (<1011 hPa)")
            .style("font","italic 10px sans-serif");
}


function draw_pressure_color(){
    new_file = "DATA/pre_umid_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    if(new_file == pre_umid_file)
    {
        update_pressure_color(pre_umid_data);
    }
    else
    {
        //console.log("update_file",new_file)
        pre_umid_file = new_file
        d3.json(pre_umid_file).then(function(pre_umid) {
            pre_umid_data = pre_umid
            update_pressure_color(pre_umid_data);        
        });
    }
    draw_pressure_color_legend();
}


function update_pressure_color(){
    for(row of pre_umid_data)
    {   
        if(row.provincia != "nan" && row.ora==ora.value)
        {
            p = svg.select("."+row.provincia)
                .attr("pressure",row.pressione_media)
                .style("fill",pressure_legend.color(row.pressione_media));
        }
    }
}

function draw_humidity_pie(){
    new_file = "DATA/pre_umid_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    if(new_file == pre_umid_file)
    {
        update_humidity_pie(pre_umid_data);
    }
    else
    {
        //console.log("update_file",new_file)
        pre_umid_file = new_file
        d3.json(pre_umid_file).then(function(pre_umid) {
            pre_umid_data = pre_umid
            update_humidity_pie(pre_umid_data);        
        });
    }
}

function update_humidity_pie(){
    for(row of pre_umid_data)
    {   
        c = centroid_map[row.provincia]
        if(row.provincia != "nan" && row.ora==ora.value && c!=undefined)
        {
            radius = 6
            c = centroid_map[row.provincia]
            
            data = [row.umidita_media, 100 - row.umidita_media]
            g_p = g_humidity_pie.append("g")
                        .attr("class","h")
                        .attr("transform","translate("+c[0]+","+c[1]+")");

            var color = d3.scaleOrdinal(['black','none'])
            var pie = d3.pie();

            var arc = d3.arc().innerRadius(0).outerRadius(radius);
            
            var arcs = g_p.selectAll("arc")
                        .data(pie(data))
                        .enter()
                        .append("g")
                        .attr("class","arc")
            arcs.append("path")
                .style("fill",function (d,i){
                    return color(i);
                })
                .attr("d",arc)
        }
    }
}