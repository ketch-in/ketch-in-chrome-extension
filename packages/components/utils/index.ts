const BASE_CLASSNAME = "ketch-in-components";

export function createElement(
  tagName: string,
  options?: ElementCreationOptions
): HTMLElement {
  const el = document.createElement(tagName, options);
  el.className = BASE_CLASSNAME;
  return el;
}
