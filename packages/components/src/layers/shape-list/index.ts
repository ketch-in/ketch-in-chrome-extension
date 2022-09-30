import PureController, { PureControllerOptions } from "../../core/PureController";
import ShapeListLayer, { ShapeListLayerProps } from "./ShapeList";

export default class ShapeListController extends PureController {
  private layer: unknown;
  constructor(targetEl: Element, options: PureControllerOptions) {
    super(targetEl, options, true);
  }

  open(props: ShapeListLayerProps) {
    this.layer = new ShapeListLayer({...props, removeDelay: 0})
    if (this.layer instanceof ShapeListLayer) {
      this.layer.mount(this.target);
    }
  }

  close() {
    if (this.layer instanceof ShapeListLayer) {
      this.layer.unmount();
    }
  }
}
