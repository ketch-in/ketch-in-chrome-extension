import PureController, { PureControllerOptions } from "../../core/PureController";
import ToolbarComponent, { ToolbarComponentProps } from "./Toolbar";

export default class ToolbarController extends PureController {
  constructor(targetEl: Element, options: PureControllerOptions) {
    super(targetEl, options);
  }

  add(props: ToolbarComponentProps) {
    return new ToolbarComponent(props).mount(this.target);
  }
}
