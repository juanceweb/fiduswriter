const generarTooltips = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

generarTooltips.map(tool => {
  return new bootstrap.Tooltip(tool);
});
