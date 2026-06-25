// createDom() runs once in draw(). layout.getSection() returns the container
// for each named page region (primary, legend, header, footer).
import { select } from "d3-selection";
import { layout, legend_container, legend_categorical, legend_continuous } from "../core/init";

let svg;

function createDom() {
  svg = select(layout.getSection("primary"))
    .append("svg");

  // Attach legend instances to the layout's legend section. Both categorical
  // and continuous legends are added here; updateLegend() controls which one
  // is visible at any given time based on the color column type.
  legend_container
    .appendTo(layout.getSection("legend"))
    .add([legend_categorical, legend_continuous]);
}

export { svg, createDom };
