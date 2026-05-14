// draw() runs once on first load — one-time setup only.
import { createDom } from "../lib/create-dom";
import update from "./update";

function draw() {
  createDom();
  update();
  window.onresize = update;
}

export default draw;
