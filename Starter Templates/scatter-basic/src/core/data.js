// The data object is populated by Flourish with the bound column values for
// each row. Pre-initialising with { data: [] } (rather than {}) ensures that
// show_if/hide_if conditions in template.yml that reference data bindings
// (e.g. data.data.color) evaluate correctly before the first data load.
const data = { data: [] };
export default data;
