import PureController, { PureControllerOptions } from "../../core/PureController";
import SelectModalComponent, { SelectModalComponentProps } from "./SelectModal";

export default class SelectModalController extends PureController {
  constructor(targetEl: Element, options: PureControllerOptions) {
    super(targetEl, options);
  }

  add(props: SelectModalComponentProps) {
    return new SelectModalComponent({
      ...props,
      modalWidth: this.getOption("modalWidth"),
      removeDelay: this.getOption("removeDelay"),
    }).mount(this.target);
  }
}
