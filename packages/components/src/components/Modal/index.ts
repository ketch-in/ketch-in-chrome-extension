import PureController, { PureControllerOptions } from "../../core/PureController";
import ModalComponent, { ModalComponentProps } from "./Modal";

export default class ModalController extends PureController {
  constructor(targetEl: Element, options: PureControllerOptions) {
    super(targetEl, options);
  }

  add(props: ModalComponentProps) {
    return new ModalComponent({
      ...props,
      modalWidth: this.getOption("modalWidth"),
      removeDelay: this.getOption("removeDelay"),
    }).mount(this.target);
  }
}
