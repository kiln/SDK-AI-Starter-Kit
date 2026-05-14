// simple_accordion starter — use for non-chart templates: no D3, no axes —
// cards, tables, lists, text layouts, accordion. The simplest Flourish structure.
//
// Reference for the content-driven height pattern (SDK_BASICS section 6,
// height category C): height is set once in update() and never changes from
// user interaction.
//
// Canvas height = all header heights + the tallest content panel.
// Because opening one item closes another simultaneously, the total stays
// constant — no resize guard or click-handler height calls are needed.
//
// NOTE: this starter intentionally avoids the interactive-height pattern
// (SDK_BASICS height category D). If your template must grow and shrink the
// iframe when the user opens/closes panels — e.g. multiple panels can be open
// at once — read category D before coding. Do not copy this click handler for
// that case: it does not resize on click and will produce a fixed-height iframe.
//
// Single-file version of the scatter-basic structure. Section dividers below
// mirror the separate files in scatter-basic (init.js, data.js, state.js…).


// =============================================================================
// INIT
// =============================================================================

import initLayout from "@flourish/layout";


// =============================================================================
// DATA
// =============================================================================

export const data = { data: [] };


// =============================================================================
// STATE
// =============================================================================

export const state = {
  header_bg:    "#3d5a80",
  header_text:  "#ffffff",
  content_bg:   "#f8f9fa",
  content_text: "#212529",
  icon_color:   "#ffffff",
  open_first:   true,
  layout:       {}
};


// =============================================================================
// INIT (continued)
// =============================================================================
// SDK_BASICS [3]: module instances at module scope, not inside draw/update.

const layout = initLayout(state.layout);


// =============================================================================
// CREATE DOM
// =============================================================================

let container;

function createDom() {
  const primary = layout.getSection("primary");
  primary.innerHTML = "";

  container = document.createElement("div");
  container.className = "accordion";
  primary.appendChild(container);
}


// =============================================================================
// DRAW
// =============================================================================

export function draw() {
  createDom();
  update();
  window.onresize = update;
}


// =============================================================================
// UPDATE
// =============================================================================

export function update() {
  layout.update();
  renderAccordion();

  const primary = layout.getSection("primary");
  if (Flourish.fixed_height) {
    // Fixed-height embed: scroll if content overflows rather than clipping.
    primary.style.overflowY = "auto";
  } else {
    primary.style.overflowY = "";
    layout.setHeight(getTotalHeight());
  }
}


// =============================================================================
// CHART
// =============================================================================

function renderAccordion() {
  if (!container) return;

  // Snapshot open state so it survives re-renders from settings changes.
  const openTitles = {};
  container.querySelectorAll(".accordion-item.open").forEach(function(el) {
    openTitles[el.dataset.title] = true;
  });

  container.innerHTML = "";

  const rows = data.data || [];
  const freshLoad = Object.keys(openTitles).length === 0;

  rows.forEach(function(row, i) {
    const title   = row.title   != null ? String(row.title)   : "";
    const content = row.content != null ? String(row.content) : "";
    const isOpen  = openTitles[title] || (i === 0 && state.open_first && freshLoad);

    // --- item wrapper ---
    const item = document.createElement("div");
    item.className = "accordion-item" + (isOpen ? " open" : "");
    item.dataset.title = title;

    // --- header ---
    const header = document.createElement("button");
    header.className = "accordion-header";
    header.style.backgroundColor = state.header_bg;
    header.style.color = state.header_text;
    header.setAttribute("aria-expanded", isOpen ? "true" : "false");

    const titleSpan = document.createElement("span");
    titleSpan.className = "accordion-title";
    titleSpan.textContent = title;

    // Chevron SVG — CSS rotates 180° when item carries class "open".
    const icon = document.createElement("span");
    icon.className = "accordion-icon";
    icon.style.color = state.icon_color;
    icon.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">'
      + '<polyline points="6 9 12 15 18 9" fill="none" stroke="currentColor"'
      + ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
      + "</svg>";

    header.appendChild(titleSpan);
    header.appendChild(icon);

    // --- content panel ---
    const panel = document.createElement("div");
    panel.className = "accordion-content";
    panel.style.backgroundColor = state.content_bg;
    panel.style.color = state.content_text;

    const inner = document.createElement("div");
    inner.className = "accordion-content-inner";
    inner.textContent = content;
    panel.appendChild(inner);

    header.addEventListener("click", function() {
      const wasOpen = item.classList.contains("open");

      // Close all open items. CSS transitions run simultaneously on each,
      // so the closing and opening animations overlap cleanly.
      container.querySelectorAll(".accordion-item.open").forEach(function(openItem) {
        openItem.classList.remove("open");
        openItem.querySelector(".accordion-header").setAttribute("aria-expanded", "false");
        openItem.querySelector(".accordion-content").style.maxHeight = "0";
      });

      if (!wasOpen) {
        item.classList.add("open");
        header.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
      // No setHeight() here — the canvas is already sized for the tallest panel.
    });

    item.appendChild(header);
    item.appendChild(panel);
    container.appendChild(item);
  });

  // Set initial maxHeight for items that start open.
  container.querySelectorAll(".accordion-item.open .accordion-content").forEach(function(el) {
    el.style.maxHeight = el.scrollHeight + "px";
  });
}

// Canvas height = sum of all header heights + tallest content panel.
// scrollHeight is unaffected by the max-height CSS transition, so this is
// accurate even before any panel has been opened.
function getTotalHeight() {
  if (!container) return 0;
  let header_total = 0;
  let max_content = 0;
  container.querySelectorAll(".accordion-item").forEach(function(item) {
    header_total += item.querySelector(".accordion-header").getBoundingClientRect().height;
    max_content = Math.max(max_content, item.querySelector(".accordion-content").scrollHeight);
  });
  return header_total + max_content;
}
