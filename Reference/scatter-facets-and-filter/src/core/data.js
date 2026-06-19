// Pre-initialising with { data: [] } (rather than {}) ensures show_if/hide_if
// conditions in template.yml that reference data bindings (e.g. data.data.color)
// evaluate correctly before the first data load. See SDK_BASICS [6].
const data = { data: [] };
export default data;
