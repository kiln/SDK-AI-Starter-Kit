// draw() runs once on load — one-time DOM setup and resize handler.
// All rendering lives in update() so it can run on every data/settings change.
import { createDom } from "../lib/create-dom";
import update from "./update";

function draw() {
  createDom();
  update();
  window.onresize = update;
}

export default draw;
