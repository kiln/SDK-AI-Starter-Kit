// Configures the popup content and formatters. Mouse/click event handlers
// are attached to the circles in chart.js — this file only sets up the module.
import { popup, xFormat, yFormat } from "../core/init";
import data from "../core/data";

// getLockedPositionCallback is called by the popup module when it needs to
// re-position a locked popup after an update() cycle (e.g. when the chart
// resizes). It receives the locked_id that was passed to popup.click() and
// must return [domNode, datum] so the popup can re-anchor itself, or null if
// the element no longer exists. For more detail, see:
// https://www.npmjs.com/package/@flourish/info-popup#8---set-up-locking-functionality-optional
function getLockedPositionCallback(locked_id) {
  const el = document.getElementById(locked_id);
  if (!el) return null;
  return [el, el.__data__];
}

function updatePopup() {
  // data.data.column_names maps each binding key (x, y, label, color) to the
  // actual column header the user has bound. Filtering out null/undefined values
  // ensures unbound optional bindings (label, color) don't appear as blank rows
  // in the popup. Passing column_names directly means the popup always shows
  // the real column name rather than a hardcoded string.
  const column_names = data.data && data.data.column_names
    ? Object.fromEntries(Object.entries(data.data.column_names).filter(([, v]) => v))
    : {};

  // setColumnNames() controls which keys appear as rows in the popup — only
  // keys present in column_names are rendered. Filtering out null/undefined
  // above ensures unbound optional bindings don't produce blank popup rows.
  popup
    .titleKey("label")
    .getLockedPosition(getLockedPositionCallback)
    .setColumnNames(column_names)
    .setFormatters({ x: xFormat, y: yFormat })
    .update();
}

export { updatePopup };
