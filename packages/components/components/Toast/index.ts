import PureController, { PureControllerOptions } from "../../core/PureController";
import ToastComponent, { ToastComponentProps } from "./Toast";

export default class ToastController extends PureController {
  constructor(targetEl: Element, options: PureControllerOptions) {
    super(targetEl, options);
  }

  add(props: ToastComponentProps) {
    return new ToastComponent({
      ...props,
      removeDelay: this.getOption("removeDelay"),
    }).mount(this.target);
  }
}
