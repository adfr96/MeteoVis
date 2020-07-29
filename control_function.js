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
    if(show == "temp")
    {
        flag_colore = "temp";
    }
    if(show == "rain")
    {
        flag_colore = "rain";
    }
    if(show == "wind")
    {
        flag_colore = "wind";
    }
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
    if(show == "pressure")
    {
        flag_over = "pressure";
    }
    if(show == "rain")
    {
        flag_over = "rain";
    }
    if(show == "wind")
    {
        flag_over = "wind";
    }
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
        //a breve
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

function remove_pressure(){
    g_pressioni.selectAll("circle").remove();
    g_pressioni.selectAll("rect").remove();
}

function remove_wind_deg() {
    g_wind.selectAll("line").remove();
}

function remove_color(){
    svg.selectAll("path").style("fill","#ccc")
    flag_colore = null;
}

function remove_legend(){
    svg_legende.select(".legend").remove();
}


function remove_over(){
    remove_wind_deg();
    remove_pressure();
    flag_over = null;
}

