import PureComponent, { PureComponentProps } from "./PureComponent";

export default class OverlayComponent extends PureComponent {
  private overlay: HTMLElement;

  constructor({
    data,
    defaultClassName,
  }: PureComponentProps) {
    super({ data, defaultClassName, removeDelay: 0 });
    const overlay = this.getOverlay();
    this.overlay = overlay;
  }

  protected getOverlay() {
    const overlay = document.body.querySelector(".ketch-in-overlay") as HTMLDivElement;
    return overlay;
  }

  protected existModal() {
    const modal = document.body.querySelector(".ketch-in-components.select-modal,.ketch-in-components.modal");
    return !!modal;
  }

  protected createOverlay() {
    const overlayEl = document.createElement("div");
    overlayEl.classList.add("ketch-in-overlay");
    return overlayEl;
  }

  async mount(target: HTMLElement) {
    if (!this.overlay) {
      this.overlay = this.createOverlay();
      document.body.appendChild(this.overlay);
    }
    const element = this.getElement();
    element.style.width = `${this.getWidth()}px`;
    return super.mount(target);
  }

  protected async unmount() {
    const res = await super.unmount();
    if (!this.existModal()) {
      this.overlay.remove();
    }
    return res;
  }
}
