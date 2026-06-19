import { popup, xFormat, yFormat } from "../core/init";
import data from "../core/data";

// Called by the popup module when it needs to re-anchor a locked popup after
// a resize or update() cycle. Receives the locked_id passed to popup.click()
// and must return [domNode, datum], or null if the element no longer exists.
// Circle IDs in this template are prefixed with the facet name (e.g. "dot-Europe-Paris")
// so getElementById works correctly across panels without ID collisions.
function getLockedPositionCallback(locked_id) {
  const el = document.getElementById(locked_id);
  if (!el) return null;
  return [el, el.__data__];
}

function updatePopup() {
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
