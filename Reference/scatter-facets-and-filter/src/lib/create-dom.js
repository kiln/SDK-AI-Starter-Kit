// createDom() runs once in draw() to build the static DOM structure and wire
// up the one-time attachments (facets grid, controls container, legend).
import { select } from "d3-selection";
import {
  layout, legend_container, legend_categorical, legend_continuous,
  facets, facet_control, controls_container
} from "../core/init";
import state from "../core/state";
import update from "../core/update";

let svg;

function createDom() {
  svg = select(layout.getSection("primary")).append("svg");

  // The facets module requires a <g> element inside the SVG as its container.
  // It positions each facet panel inside this group.
  const facets_group = svg.append("g").attr("class", "facets-group").node();
  facets.appendTo(facets_group);

  // Attach the controls container to the layout's controls section and add the
  // facet filter control. appendTo() and .on("change") both run once here in
  // createDom() rather than in controls.js. appendTo() must only be called once
  // (calling it again on every update() would re-attach the container). The
  // change handler also lives here because controls.js imports from init.js —
  // putting `update` in controls.js would create a circular import
  // (update.js → controls.js → update.js).
  controls_container
    .appendTo(layout.getSection("controls"))
    .add([facet_control]);

  facet_control.on("change", (value) => {
    state.selected_facet = value;
    update();
  });

  legend_container
    .appendTo(layout.getSection("legend"))
    .add([legend_categorical, legend_continuous]);
}

export { svg, createDom };
