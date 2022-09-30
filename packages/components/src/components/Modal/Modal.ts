import { PureComponentProps } from "../../core/PureComponent";
import OverlayComponent from "../../core/OverlayComponent";

export interface ModalComponentProps extends PureComponentProps {
  children: HTMLElement;
  onClose?: (item: OverlayComponent) => number | void;
}

export default class ModalComponent extends OverlayComponent {
  private children: HTMLElement;

  private onClose: () => number | void;

  constructor({
    children,
    modalWidth,
    data = {},
    onClose = () => {},
  }: ModalComponentProps) {
    super({ data, modalWidth, defaultClassName: "modal" });
    this.children = children;
    this.onClose = () => onClose(this);
  }

  mount(target: HTMLElement) {
    const element = this.getElement();

    const bodyEl = this.createElement("div");
    bodyEl.append(this.children);
    bodyEl.classList.add("body");
    element.appendChild(bodyEl);

    const closeEl = this.createElement("span");
    /** TODO : 닫기 아이콘으로 변경 예정 */
    closeEl.innerText = "닫기";
    closeEl.classList.add("close");
    closeEl.onclick = async () => {
      await this.unmount();
      this.onClose();
    };
    element.appendChild(closeEl);

    return super.mount(target);
  }
}
