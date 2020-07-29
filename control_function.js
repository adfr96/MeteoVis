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


function update_color_map(show){
    flag_colore = show;
    update_color()
}


function update_color(){
    if(flag_colore == "temp")
    {
        draw_temp();
    }
    if(flag_colore == "rain")
    {
        draw_rain_color();
    }
    if(flag_colore == "wind")
    {
        draw_wind_intensity();
    } 
}

function update_over_map(show){
    flag_over = show;
    
    update_over();
}


function update_over(){
    remove_over();
    console.log(flag_over)
    if(flag_over == "pressure")
    {
        console.log("draw pressure")
        draw_pressure();
    }
    if(flag_over == "rain")
    {
        draw_rain();
    }
    if(flag_over == "wind")
    {
        draw_wind_deg();
    } 
}

function update_all(){
    update_color();
    update_over();

}

function handleMouseClickProvinces(d,i){
    id_prov = (this.getAttribute("class"))

    d3.select("#info_area").selectAll("li").remove();

    d3.select("#info_area").append("li")
        .text("province:"+id_prov);

    d3.select("#info_area").append("li")
    .text("temperatura media:"+get_temp_from_data(id_prov)+" °C");

    d3.select("#info_area").append("li")
    .text("pressione media:"+get_pressure_from_data(id_prov)+" hPa");

    w = get_wind_from_data(id_prov)
    d3.select("#info_area").append("li")
    .text("Vento Massimo:"+w[0]+" m/s");

    d3.select("#info_area").append("li")
    .text("Angolo Vento Massimo:"+w[1]+"°");

    d3.select("#info_area").append("li")
    .text("Somma Pioggia:"+get_rain_from_data(id_prov)+" mm");
}

function get_temp_from_data(prov){
    for(row of temp_data)
    {   
        if(row.provincia == prov && row.ora==ora.value)
        {
            return parseFloat(row.media_temp).toFixed(2);
        }
    }
}

function get_pressure_from_data(prov){
    for(row of pre_umid_data)
    {   
        if(row.provincia == prov && row.ora==ora.value)
        {
            return parseFloat(row.pressione_media).toFixed(2);
        }
    }
}

function get_rain_from_data(prov){
    for(row of rain_data)
    {   
        if(row.provincia == prov && row.ora==ora.value)
        {
            return parseFloat(row.sum_rain).toFixed(2);
        }
    }
}

function get_wind_from_data(prov){
    for(row of wind_data)
    {   
        if(row.provincia == prov && row.ora==ora.value)
        {
            return [parseFloat(row.wind_speed_max).toFixed(1),parseFloat(row.wind_deg_max).toFixed(1)];
        }
    }
}
function remove_pressure(){
    g_pressioni.selectAll("circle").remove();
    g_pressioni.selectAll("rect").remove();
}

function remove_wind_deg() {
    g_wind.selectAll("line").remove();
}

function remove_rain_bar(){
    g_rain.selectAll(".r").remove();
}

function remove_color(){
    g_italy.selectAll("path").style("fill","#ccc")
    flag_colore = null;
}

function remove_legend(){
    svg_legende.select(".legend").remove();
}


function remove_over(){
    remove_wind_deg();
    remove_pressure();
    remove_rain_bar();
}

function handle_remove_over(){
    flag_over = null;
    remove_over();
}

function load_file(){
    temp_file = "DATA/temp_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
    t = d3.json(temp_file).then(function(meteo) {
        temp_data = meteo 
    });

    wind_file = "DATA/wind_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
     d3.json(wind_file).then(function(meteo) {
        wind_data = meteo
    });

    rain_file = "DATA/rain_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
     d3.json(rain_file).then(function(meteo) {
        rain_data = meteo
    });

    pre_umid_file = "DATA/pre_umid_provincie_"+anno.value+"-"+mese.value+"-"+giorno.value+".json"
     d3.json(pre_umid_file).then(function(pre_umid) {
            pre_umid_data = pre_umid  
    });
    return t
}