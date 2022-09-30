import { createElement } from "../utils";

type State = "mount" | "unmount" | "unmounting";

export interface PureComponentProps {
  data?: unknown;
  modalWidth?: number;
  removeDelay?: number;
  defaultClassName?: string;
}

export default class PureComponent {
  private data?: unknown;
  private state: State;
  private element: HTMLElement;
  private defaultClassName: string;
  private modalWidth: number;

  constructor({
    data,
    defaultClassName,
    modalWidth = 200,
  }: PureComponentProps) {
    this.data = data;
    this.state = "unmount";
    this.defaultClassName = defaultClassName || "";

    this.modalWidth = modalWidth;

    this.element = this.createElement("div");
    this.element.classList.add("container");
  }

  protected createElement(tagName: string, options?: ElementCreationOptions) {
    const el = createElement(tagName, options);
    el.classList.add(this.defaultClassName);
    return el;
  }

  protected createSVGElement(width: number, height: number) {
    const xmlns = "http://www.w3.org/2000/svg";
    const el = document.createElementNS(xmlns, 'svg');
    el.setAttribute('width', width.toString());
    el.setAttribute('height', height.toString());
    el.classList.add(this.defaultClassName);
    return el;
  }

  getData() {
    return this.data;
  }

  private setState(state: State) {
    this.state = state;
    if (this.isUnmounting()) {
      this.element.classList.add("unmount");
    } else {
      this.element.classList.remove("unmount");
    }

    return this;
  }

  protected getState() {
    return this.state;
  }

  protected getElement() {
    return this.element;
  }

  protected getWidth() {
    return this.modalWidth;
  }

  protected isMount() {
    return this.getState() === "mount";
  }

  protected isUnmount() {
    return this.getState() === "unmount";
  }

  protected isUnmounting() {
    return this.getState() === "unmounting";
  }

  protected async clear() {
    if (!this.isUnmount()) {
      await this.unmount();
    }
    return this;
  }

  protected async mount(target: HTMLElement) {
    target.append(this.element);
    return this.setState("mount");
  }

  protected unmounting() {
    this.setState("unmounting");
  }

  protected async unmount() {
    this.element.remove();
    this.setState("unmount");
    return await this.clear();
  }
}
