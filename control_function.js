function handleMouseOverProvinces(d,i){
    value = parseFloat(this.getAttribute("media_temp")).toFixed(2)
    id_prov = (this.getAttribute("class"))
    x = centroid_map[id_prov][0]
    y = centroid_map[id_prov][1]
    g_over.append("text")
        .attr("class","value_over")
        .attr("transform", "translate("+x+"," + y+ ")")
        .text(provinces_map[id_prov])
}

function handleMouseOutProvinces(d,i){
    g_over.select(".value_over").remove();
}

function update_color_map(show){
    flag_colore = show;
    update_color()
}

function update_color(){
    if(flag_colore == "temp")
    {
        draw_temp();
        return
    }
    if(flag_colore == "rain")
    {
        draw_rain_color();
        return
    }
    if(flag_colore == "wind")
    {
        draw_wind_intensity();
        return
    }
    if(flag_colore == "pressure")
    {
        draw_pressure_color();
    }
}

function update_over_map(show){
    flag_over = show;
    
    update_over();
}

function update_over(){
    remove_over();
    if(flag_over == "pressure")
    {
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
    if(flag_over == "humidity")
    {
        draw_humidity_pie();
    } 
}

function update_all(){
    update_color();
    update_over();
    update_info_area();

}

function handleMouseClickProvinces(d,i){
    id_prov = (this.getAttribute("class"))
    prov_selected = id_prov
    update_info_area();
}

function update_info_area(){

    d3.select("#info_area").selectAll("li").remove();

    d3.select("#info_area").append("li")
    .text("Province:"+provinces_map[prov_selected]);

    d3.select("#info_area").append("li")
    .text("Temperatura media:"+get_temp_from_data(prov_selected)+" °C");

    d3.select("#info_area").append("li")
    .text("Pressione media:"+get_pressure_humidity_from_data(prov_selected)[0]+" hPa");

    w = get_wind_from_data(prov_selected)
    d3.select("#info_area").append("li")
    .text("Vento Massimo:"+w[0]+" m/s");

    d3.select("#info_area").append("li")
    .text("Angolo Vento Massimo:"+w[1]+"°");

    d3.select("#info_area").append("li")
    .text("Somma Pioggia:"+get_rain_from_data(prov_selected)+" mm");

    d3.select("#info_area").append("li")
    .text("Umidità media:"+get_pressure_humidity_from_data(prov_selected)[1]+" %");
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

function get_pressure_humidity_from_data(prov){
    for(row of pre_umid_data)
    {   
        if(row.provincia == prov && row.ora==ora.value)
        {
            return [parseFloat(row.pressione_media).toFixed(2),parseFloat(row.umidita_media)];
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

function remove_humidity_pie(){
    g_humidity_pie.selectAll(".h").remove();
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
    remove_humidity_pie();
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
    
    d3.csv("DATA/id_provincie_tagliato.csv").then(function(data) {
        for(row of data)
        {
            
            provinces_map[row['PROVINCIA']] = row['CITTA']
        }
        //console.log(provinces_map);
      });
    return t
}