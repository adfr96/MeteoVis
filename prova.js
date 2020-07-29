import {legend} from "@d3/color-legend"

legend({
  color: d3.scaleSequential([0, 100], d3.interpolateViridis),
  title: "Temperature (°F)"
})