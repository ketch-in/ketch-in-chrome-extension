import MomentComponent, { MomentComponentProps } from "../../core/MomentComponent";

export interface ToastComponentProps extends MomentComponentProps {
  children: HTMLElement;
  onClick?: (item: ToastComponent) => void;
  onClose?: (item: ToastComponent, action: boolean) => number | void;
}

export default class ToastComponent extends MomentComponent {
  private children: HTMLElement;
  private removeDelay: number;

  private onClick: (item: ToastComponent) => void;
  private onClose: (action: boolean) => number | void;

  constructor({
    children,
    data = {},
    removeDelay = 2000,
    momentDelay = 2000,
    onClick = () => {},
    onClose = () => {},
  }: ToastComponentProps) {
    super({ momentDelay, data, defaultClassName: "toast" });

    this.children = children;
    this.removeDelay = removeDelay;

    this.onClick = onClick;
    this.onClose = (action) => onClose(this, action);
  }

  protected setRemoveDelay(removeDelay: number) {
    this.removeDelay = removeDelay;
    return this;
  }

  protected getRemoveDelay() {
    return this.removeDelay;
  }

  mount(target: HTMLElement) {
    const element = this.getElement();

    const bodyEl = this.createElement("div");
    const closeEl = this.createElement("span");

    bodyEl.append(this.children);
    /** TODO : 닫기 아이콘으로 변경 예정 */
    closeEl.innerText = "닫기";

    bodyEl.classList.add("text");
    closeEl.classList.add("close");

    element.appendChild(bodyEl);
    element.appendChild(closeEl);

    element.onclick = (e: MouseEvent) => {
      element.onclick = () => {};
      if (e.composedPath().some((target) => target === closeEl)) {
        return;
      }
      this.unmount(true).then(this.onClick);
    };

    closeEl.onclick = () => {
      closeEl.onclick = () => {};
      this.unmount(true);
    };

    return super.mount(target);
  }

  unmount(action: boolean = false) {
    return new Promise<this>((resolve) => {
      if (this.isMount()) {
        const customDelay = this.onClose(action);
        const delay = (
          !!customDelay || customDelay === 0 ? customDelay : this.getRemoveDelay()
        ) as number;
        this.setRemoveDelay(delay);
      } else {
        const interval = setInterval(() => {
          if (this.isUnmount()) {
            clearInterval(interval);
            return resolve(this);
          }
        }, 1000);
      }

      this.unmounting();

      setTimeout(async () => await super.unmount(), this.getRemoveDelay());
    });
  }
}
